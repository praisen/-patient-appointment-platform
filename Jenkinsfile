pipeline {
  agent any
  environment {
    DOCKERHUB_ORG = 'YOUR_DOCKERHUB_USER'
    BACKEND_IMAGE = "docker.io/${DOCKERHUB_ORG}/patientapp-backend"
    FRONTEND_IMAGE = "docker.io/${DOCKERHUB_ORG}/patientapp-frontend"
    GIT_REPO_HTTPS = 'YOUR_GITHUB_REPO_HTTPS'
  }
  options { timestamps() }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('SonarQube Scan') {
      steps {
        withSonarQubeEnv('sonarqube') {
          withEnv(['SCANNER_HOME=SonarQubeScanner']) {
            sh "${SCANNER_HOME}/bin/sonar-scanner"
          }
        }
      }
    }
    stage('Build & Push Images') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh '''
            echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
            docker build -t ${BACKEND_IMAGE}:${GIT_COMMIT} backend
            docker build -t ${FRONTEND_IMAGE}:${GIT_COMMIT} frontend
            docker tag ${BACKEND_IMAGE}:${GIT_COMMIT} ${BACKEND_IMAGE}:latest
            docker tag ${FRONTEND_IMAGE}:${GIT_COMMIT} ${FRONTEND_IMAGE}:latest
            docker push ${BACKEND_IMAGE}:${GIT_COMMIT}
            docker push ${FRONTEND_IMAGE}:${GIT_COMMIT}
            docker push ${BACKEND_IMAGE}:latest
            docker push ${FRONTEND_IMAGE}:latest
          '''
        }
      }
    }
    stage('Update Kustomize (dev) and Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'github-creds', usernameVariable: 'GIT_USER', passwordVariable: 'GIT_TOKEN')]) {
          sh '''
            git config user.email "ci@local"
            git config user.name "jenkins-ci"
            cd k8s/overlays/dev
            kustomize edit set image patientapp-backend=${BACKEND_IMAGE}:${GIT_COMMIT}
            kustomize edit set image patientapp-frontend=${FRONTEND_IMAGE}:${GIT_COMMIT}
            cd -
            git add k8s/overlays/dev/kustomization.yaml
            git commit -m "ci: update images to ${GIT_COMMIT}"
            git remote set-url origin ${GIT_REPO_HTTPS}
            git push origin HEAD:${BRANCH_NAME}
          '''
        }
      }
    }
  }
}
