pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/HariMuthuGanesh/DevOps.git'
            }
        }
        stage('Install dependencies') {
            steps {
                dir('Mini_Calculator') {
                    bat 'npm install'
                }
            }
        }
        stage('Build') {
            steps {
                dir('Mini_Calculator') {
                    bat 'npm run build'
                }
            }
        }
        stage('Deploy') {
            steps {
                dir('Mini_Calculator') {
                    bat 'if not exist "C:\\ProgramData\\Jenkins\\.jenkins\\userContent\\minicalculator" mkdir "C:\\ProgramData\\Jenkins\\.jenkins\\userContent\\minicalculator"'
                    bat 'xcopy /E /I /Y "dist\\*" "C:\\ProgramData\\Jenkins\\.jenkins\\userContent\\minicalculator\\"'
                }
            }
        }
    }

    post {
        success {
            echo 'Mini Calculator built and deployed successfully!'
        }
        failure {
            echo 'Mini Calculator Pipeline Build Failed!'
        }
    }
}
