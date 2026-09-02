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
                    bat '''
                    if not exist "C:\\ProgramData\\Jenkins\\.jenkins\\userContent\\BMI_Calculator" (
                        mkdir "C:\\ProgramData\\Jenkins\\.jenkins\\userContent\\BMI_Calculator"
                    )

                    xcopy /E /I /Y dist\\* "C:\\ProgramData\\Jenkins\\.jenkins\\userContent\\BMI_Calculator\\"
                    '''
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