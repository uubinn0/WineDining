pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "rlatmddbsk75/winedining-backend"
        FRONTEND_IMAGE = "rlatmddbsk75/winedining-frontend"
        DOCKER_HUB_USERNAME = "rlatmddbsk75"
        DOCKER_HUB_REPO_BACKEND = "rlatmddbsk75/winedining-backend"
        DOCKER_HUB_REPO_FRONTEND = "rlatmddbsk75/winedining-frontend"
        IMAGE_TAG = "${env.BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                dir('frontend/winedining') {
                    sh "docker build -t ${FRONTEND_IMAGE} ."
                }
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                dir('backend') {
                    sh "docker build -t ${BACKEND_IMAGE} ."
                }
            }
        }

        stage('Tag and Push Docker Images') {
            steps {
                withDockerRegistry([credentialsId: 'dockerhub-token', url: '']) {
                    sh "docker tag ${BACKEND_IMAGE} ${DOCKER_HUB_REPO_BACKEND}:${IMAGE_TAG}"
                    sh "docker push ${DOCKER_HUB_REPO_BACKEND}:${IMAGE_TAG}"

                    sh "docker tag ${FRONTEND_IMAGE} ${DOCKER_HUB_REPO_FRONTEND}:${IMAGE_TAG}"
                    sh "docker push ${DOCKER_HUB_REPO_FRONTEND}:${IMAGE_TAG}"
                }
            }
        }

        stage('Deploy') {
            steps {
                script {
                    withCredentials([file(credentialsId: 'jenkins-env', variable: 'ENV_FILE')]) {
                        // Jenkins의 Secret File을 현재 작업공간으로 복사
                        sh 'cp $ENV_FILE ./.env'

                        // Docker compose 실행
                        // sh 'docker compose down'
                        sh 'docker compose up -d'
                        sh 'docker image prune -f'

                        // .env 파일 삭제 (보안 유지)
                        sh 'rm ./.env'
                    }
                }
            }
        }
    }

    post {
        success {
            echo '빌드, 태깅, 배포 성공!'
        }
        failure {
            echo '문제가 발생했습니다. 로그를 확인하세요.'
        }
    }
}
