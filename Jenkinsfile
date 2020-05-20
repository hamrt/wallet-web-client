
pipeline {
    agent any
    environment {
        VERSION=sh(script: 'sudo runuser -l ebsi1-robot -c "AWS_REPO=intebsi/wallet-web-client bash /opt/ebsi_containers_int/auto-deploy/minor_version.sh"', returnStdout: true).trim()
    }
    stages {
        stage('Clone repo') {
            steps {
               checkout scm;
            }
        }
        stage('Unit Test') {
            steps{
                sh "npm install"
                sh "npm run test"
            }
        }
        stage('SonarQube Analysis') {
            steps {
                sh "/var/lib/jenkins/tools/hudson.plugins.sonar.SonarRunnerInstallation/sonar-scanner/bin/sonar-scanner -Dsonar.host.url=https://infra.ebsi.xyz/sonar -Dsonar.projectName=2-wallet-ui -Dsonar.projectVersion=1.0 -Dsonar.projectKey=2-wallet-ui -Dsonar.sources=. -Dsonar.projectBaseDir=/var/lib/jenkins/workspace/Autodeploy_intebsi-2-wallet-ui"
            }
        }
        stage('Build image') {
            steps {
                sh "sudo VERSION=${VERSION}_${GIT_COMMIT} AWS_REPO=intebsi/wallet-web-client bash /opt/ebsi_containers_int/auto-deploy/build.sh"
            }
        }
        stage('Push to ECR') {
            steps {
                 sh "sudo `sudo su - ebsi1-robot -c 'aws ecr get-login --no-include-email --region eu-central-1'`"
                 sh "sudo docker push 305472350643.dkr.ecr.eu-central-1.amazonaws.com/intebsi/wallet-web-client"
             }
        }
        stage("Deploy on first machine") {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'ebsi1-robot', keyFileVariable: 'PK')]) {
                       sh "ssh -i $PK ebsi1-operator@app01-0-ebsi-int-lux.intebsi.xyz -o StrictHostKeyChecking=no -o 'UserKnownHostsFile /dev/null' -p 48722 'aws ecr get-login --no-include-email --region eu-central-1 | bash && cd /opt/ebsi/wallet-web-client && docker-compose pull && docker-compose up -d'"
                       sh "ssh -i $PK ebsi1-operator@app02-0-ebsi-int-lux.intebsi.xyz -o StrictHostKeyChecking=no -o 'UserKnownHostsFile /dev/null' -p 48722 'aws ecr get-login --no-include-email --region eu-central-1 | bash && cd /opt/ebsi/wallet-web-client && docker-compose pull && docker-compose up -d'"
                    }
                }
        }
    }
}
