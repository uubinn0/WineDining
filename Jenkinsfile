pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "rlatmddbsk75/winedining-backend"
        FRONTEND_IMAGE = "rlatmddbsk75/winedining-frontend"
        NGINX_IMAGE = "rlatmddbsk75/winedining-nginx"

        DOCKER_HUB_USERNAME = "rlatmddbsk75"
        DOCKER_HUB_REPO_BACKEND = "rlatmddbsk75/winedining-backend"
        DOCKER_HUB_REPO_FRONTEND = "rlatmddbsk75/winedining-frontend"
        DOCKER_HUB_REPO_NGINX = "rlatmddbsk75/winedining-nginx"
        
        IMAGE_TAG = "${env.BUILD_NUMBER}"

        DEPLOY_HOST = "ubuntu@j12b202.p.ssafy.io" // EC2 서버의 IP 주소
        DEPLOY_PATH = "/home/ubuntu/winedining"       // EC2 내부 배포 경로
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Update Env File') {
            steps {
                withCredentials([file(credentialsId: 'jenkins-env', variable: 'ENV_FILE')]) {
                    // 현재 작업 디렉토리 확인 및 Credential로 불러온 .env 파일 내용 출력
                    sh 'ls -al'
                    sh 'cat $ENV_FILE'
                    // .env 파일의 IMAGE_TAG 값을 현재 빌드 번호로 업데이트하여 updated.env 파일 생성
                    sh 'sed "s/^IMAGE_TAG=.*/IMAGE_TAG=${IMAGE_TAG}/" $ENV_FILE > updated.env'
                    sh 'cat updated.env'
                }
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend/winedining') {
                    sh "docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    sh "docker build -t ${BACKEND_IMAGE}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Build Nginx Docker Image') {
            steps {
                dir('nginx') {
                    sh "docker build -t ${NGINX_IMAGE}:${IMAGE_TAG} ."
                }
            }
        }

        stage('Tag and Push Docker Images') {
            steps {
                withDockerRegistry([credentialsId: 'dockerhub-token', url: '']) {
                    sh "docker tag ${BACKEND_IMAGE}:${IMAGE_TAG} ${DOCKER_HUB_REPO_BACKEND}:${IMAGE_TAG}"
                    sh "docker push ${DOCKER_HUB_REPO_BACKEND}:${IMAGE_TAG}"

                    sh "docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${DOCKER_HUB_REPO_FRONTEND}:${IMAGE_TAG}"
                    sh "docker push ${DOCKER_HUB_REPO_FRONTEND}:${IMAGE_TAG}"

                    sh "docker tag ${NGINX_IMAGE}:${IMAGE_TAG} ${DOCKER_HUB_REPO_NGINX}:${IMAGE_TAG}"
                    sh "docker push ${DOCKER_HUB_REPO_NGINX}:${IMAGE_TAG}"
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'jenkins-env', variable: 'ENV_FILE')]) {
                        sshagent(['ec2-ssh-key']) {
                            sh '''
                            # 먼저 기존의 .env 파일 삭제 (권한 문제 방지)
                            ssh -o StrictHostKeyChecking=no ${DEPLOY_HOST} "rm -f ${DEPLOY_PATH}/.env"

                            # 환경변수 파일 및 docker-compose.yml 파일을 EC2로 전송
                            scp -o StrictHostKeyChecking=no updated.env  ${DEPLOY_HOST}:${DEPLOY_PATH}/.env
                            scp -o StrictHostKeyChecking=no docker-compose.yml ${DEPLOY_HOST}:${DEPLOY_PATH}/docker-compose.yml

                            # EC2에서 Docker Compose 실행하여 최신 컨테이너 배포
                            ssh -o StrictHostKeyChecking=no ${DEPLOY_HOST} "
                            cd ${DEPLOY_PATH} &&
                            export IMAGE_TAG=${IMAGE_TAG} &&
                            # docker login -u '${DOCKER_HUB_USERNAME}' &&
                            docker compose down --remove-orphans &&
                            docker compose pull &&
                            docker compose up -d
                            # docker image prune -f &&
                            # rm -f ${DEPLOY_PATH}/.env
                            "
                            '''
                        }
                    }
                }
            }
        }
    }

    post {
        success {
            echo '✅ 빌드, 태깅, 배포 성공!'
        }
        failure {
            echo '❌ 문제가 발생했습니다. 로그를 확인하세요.'
        }
    }
}
