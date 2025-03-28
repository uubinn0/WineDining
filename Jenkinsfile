pipeline {
    agent any

    environment {
        BRANCH_NAME = "${GIT_BRANCH}"
        NODE_VERSION = 'node20'
        DEPLOY_PATH = '/home/ubuntu/nginx/html'
        JAVA_VERSION = 'jdk17'
        APP_NAME = 'react-container'
        DOCKER_IMAGE = 'react-container:latest'
        // FastAPI 관련 환경 변수
        PYTHON_VERSION = 'python3.10'  // 사용할 Python 버전
        FASTAPI_APP_NAME = 'recommendation-api'
        FASTAPI_DOCKER_IMAGE = 'recommendation-api:latest'
        FASTAPI_PORT = '8000'  // FastAPI가 사용할 포트
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
                script {
                    echo "현재 브랜치: ${BRANCH_NAME}"
                }
            }
        }

        stage('Backend Build & Deploy') {
            when {
                expression { BRANCH_NAME == 'origin/backend' }
            }
            tools {
                jdk "${JAVA_VERSION}"
            }
            steps {
                dir('backend') {
                    script {
                        sh '''
                            echo "===== Build Environment ====="
                            echo "JDK Version:"
                            java --version
                            echo "Docker Version:"
                            docker --version
                            echo "Current Directory:"
                            pwd
                            ls -la
                        '''

                        // Prepare Environment
                        sh '''
                            rm -rf src/main/resources
                            mkdir -p src/main/resources
                            chmod 777 src/main/resources
                        '''

                        // 시크릿 파일 설정 부분 (필요시 주석 해제)
                        withCredentials([
                            file(credentialsId: 'prod-yaml', variable: 'prodFile'),
                            file(credentialsId: 'secret-yaml', variable: 'secretFile')
                        ]) {
                        sh '''
                            cp "$prodFile" src/main/resources/application-prod.yml
                            cp "$secretFile" src/main/resources/application-secret.yml
                            chmod 644 src/main/resources/application-*.yml
                        '''
                        }

                        // Gradle 빌드
                        sh '''
                            chmod +x gradlew
                            ./gradlew clean build -x test --no-daemon
                        '''
                        
                        // Docker 배포
                        sh '''
                            docker rm -f ${APP_NAME} || true
                            docker rmi ${DOCKER_IMAGE} || true
                            docker build -t ${DOCKER_IMAGE} .
                            docker run -d \
                                --name ${APP_NAME} \
                                -e SPRING_SERVLET_MULTIPART_MAX_FILE_SIZE=50MB \
                                -e SPRING_SERVLET_MULTIPART_MAX_REQUEST_SIZE=100MB \
                                --network my-network \
                                --restart unless-stopped \
                                -p 8080:8080 \
                                ${DOCKER_IMAGE}
                        '''
                    }
                }
            }
            post {
                success {
                    echo '백엔드 빌드 및 배포 성공'
                }
                failure {
                    echo '백엔드 빌드 및 배포 실패'
                }
            }
        }

        stage('Frontend Build & Deploy') {
            when {
                expression { BRANCH_NAME == 'origin/frontend' }
            }
            tools {
                nodejs "${NODE_VERSION}"
            }
            steps {
                dir('frontend/winedining') {
                    script {
                        // 빌드 전 상태 출력
                        sh '''
                            echo "===== Build Environment ====="
                            echo "Node Version:"
                            node --version
                            echo "NPM Version:"
                            npm --version
                            echo "Current Directory:"
                            pwd
                            ls -la
                        '''
                        // 시크릿 파일 설정 부분 (필요시 주석 해제)
                        withCredentials([
                            file(credentialsId: 'react-env', variable: 'envFile')
                        ]) {
                        sh '''
                            cp "$envFile" .env
                            chmod 644 .env
                        '''
                        }
                        
                        sh '''
                            echo "===== Starting Build Process ====="
                            rm -rf node_modules
                            npm install
                            CI=false npm run build
                        '''
                        
                        // 배포
                        sh '''
                            echo "===== Starting Deployment ====="
                            echo "Cleaning deployment directory..."
                            rm -rf ${DEPLOY_PATH}/*
                            
                            echo "Copying build files..."
                            cp -r build/* ${DEPLOY_PATH}/
                            
                            echo "Verifying deployment..."
                            ls -la ${DEPLOY_PATH}
                        '''
                    }
                }
            }
            post {
                success {
                    echo '프론트엔드 빌드 및 배포 성공'
                }
                failure {
                    echo '프론트엔드 빌드 및 배포 실패'
                }
            }
        }

        stage('Recommendation API Build & Deploy') {
            when {
                expression { BRANCH_NAME == 'origin/recommendation' }
            }
            tools {
                // Jenkins에 설정된 Python 도구를 사용합니다. 
                // 없는 경우 Jenkins 글로벌 도구 설정에서 추가해야 합니다.
                python "${PYTHON_VERSION}"
            }
            steps {
                dir('fastapi') {  // FastAPI 코드가 있는 디렉토리로 변경하세요
                    script {
                        sh '''
                            echo "===== Build Environment ====="
                            echo "Python Version:"
                            python --version
                            echo "Pip Version:"
                            pip --version
                            echo "Docker Version:"
                            docker --version
                            echo "Current Directory:"
                            pwd
                            ls -la
                        '''

                        // 가상환경 설정 및 의존성 설치
                        sh '''
                            python -m venv venv
                            . venv/bin/activate
                            pip install --upgrade pip
                            pip install -r requirements.txt
                        '''

                        // 환경 변수 파일 설정 (필요한 경우)
                        withCredentials([
                            file(credentialsId: 'fastapi-env', variable: 'envFile')
                        ]) {
                            sh '''
                                cp "$envFile" .env
                                chmod 644 .env
                            '''
                        }

                        // Docker 이미지 빌드 및 배포
                        sh '''
                            docker rm -f ${FASTAPI_APP_NAME} || true
                            docker rmi ${FASTAPI_DOCKER_IMAGE} || true
                            docker build -t ${FASTAPI_DOCKER_IMAGE} .
                            docker run -d \\
                                --name ${FASTAPI_APP_NAME} \\
                                --network my-network \\
                                --restart unless-stopped \\
                                -p ${FASTAPI_PORT}:${FASTAPI_PORT} \\
                                ${FASTAPI_DOCKER_IMAGE}
                        '''
                    }
                }
            }
            post {
                success {
                    echo '추천 API 빌드 및 배포 성공'
                }
                failure {
                    echo '추천 API 빌드 및 배포 실패'
                }
            }
        }
    }

    post {
        success {
            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                withCredentials([string(credentialsId: 'mattermost-webhook', variable: 'WEBHOOK_URL')]) {
                    mattermostSend(color: 'good',
                        message: "빌드 성공: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)",
                        endpoint: WEBHOOK_URL,
                        channel: 'b202_'
                    )
                }
            }
        }
        failure {
            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                withCredentials([string(credentialsId: 'mattermost-webhook', variable: 'WEBHOOK_URL')]) {
                    mattermostSend(color: 'danger',
                        message: "빌드 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)",
                        endpoint: WEBHOOK_URL,
                        channel: 'b202_'
                    )
                }
            }
        }
    }
}
