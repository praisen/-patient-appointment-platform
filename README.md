# Patient Appointment Platform (3-tier + CI/CD)

A simple healthcare appointment app with:
- Frontend: NGINX serving static HTML/JS
- Backend: Node.js (Express) API
- Database: PostgreSQL
- CI/CD: GitHub → Jenkins → SonarQube → Docker Hub → Argo CD → Kubernetes

## Quick local run
- docker compose up -d --build
- Open backend: http://localhost:8080/api/health; frontend: http://localhost:8081

## CI/CD high-level
1) Push to GitHub triggers Jenkins
2) Jenkins runs Sonar scan, builds and pushes Docker images to Docker Hub
3) Jenkins updates k8s/overlays/dev images and pushes back to GitHub
4) Argo CD detects change and deploys to Kubernetes

## AWS deploy (summary)
- Create EKS cluster (eksctl); install Argo CD; apply argocd/app-dev.yaml; expose frontend Service (type LoadBalancer)

Replace placeholders: YOUR_DOCKERHUB_USER, YOUR_GITHUB_REPO_HTTPS