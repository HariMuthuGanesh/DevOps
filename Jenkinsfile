pipeline {
    agent any

    stages {

        stage("CheckOut") {
            steps {
                git branch: 'main', url: 'https://github.com/HariMuthuGanesh/DevOps.git'
            }
        }

        stage("Dependency") {
            steps { 
                dir("BMI_Calculator") {
                    bat "npm install"
                }
            }
        }

        stage("Build") {
            steps {
                dir("BMI_Calculator") {
                    bat "npm run build"
                }
            }
        }

        stage("Deploy") {
            steps {
                dir("BMI_Calculator") {
                   bat 'npm run dev'
                }
            }
        }
    }

    post {
        success {
            echo '========================================'
            echo 'BUILD SUCCESSFUL'
            echo 'Application URL: http://localhost:8081'
            echo '========================================'
        }

        failure {
            echo '========================================'
            echo 'BUILD FAILED'
            echo '========================================'
        }
    }
}