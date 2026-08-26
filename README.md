# DevOps Model Lab Repository

Welcome to the **DevOps Model Lab** repository. This project demonstrates end-to-end DevOps practices, including Git source control management, React web application development, and Jenkins CI/CD pipeline automation.

---

## 📁 Repository Structure

```
DevOps/
├── Mini_Calculator/          # Experiment 1 & 2: Minimum React Application (Vite + React)
│   ├── src/                  # React source components (App.jsx, main.jsx, index.css)
│   ├── package.json          # Dependencies & scripts
│   ├── vite.config.js        # Vite bundler configuration
│   ├── Jenkinsfile           # Jenkins Pipeline definition for Mini Calculator
│   └── JENKINS_BUILD_STEPS.bat # Windows Batch build script for Freestyle jobs
├── Student_Management/       # React Application: Student Management System
│   ├── src/                  # React components (Header, StudentForm, StudentList, StudentCard)
│   ├── package.json          # Dependencies & scripts
│   ├── Jenkinsfile           # Jenkins Pipeline definition for Student Management
│   └── JENKINS_BUILD_STEPS.bat # Batch build script for Freestyle jobs
├── Backend API Developement/  # Node.js / Express REST API backend service
│   ├── server.js             # Express API entry point
│   ├── package.json          # Dependencies & scripts
│   └── README.md             # Backend service documentation
├── FreeStyle_Project/        # Jenkins Freestyle Job automation setup
│   ├── JENKINS_FREESTYLE_STEPS.bat # Freestyle job execution script
│   └── README.md             # Freestyle job configuration guide
├── Jenkinsfile               # Root Jenkins Declarative Pipeline
└── README.md                 # Project & Lab manual (this file)
```

---

## 🧪 Experiment 1: GitHub Commands & React Applications

### Overview
Construct functional React applications (`Mini_Calculator`, `Student_Management`), initialize Git version control, and push all project directories cleanly to GitHub.

### Key GitHub Commands Used
```bash
# Check repository status
git status

# Add files to staging area
git add .

# Commit changes with descriptive message
git commit -m "Complete Student Management application with full state management and Jenkins build scripts"

# Push changes to remote main branch
git push origin main
```

---

## 🧪 Experiment 2: Jenkins CI/CD Automation

### Overview
Automate the build, testing, and deployment of the React applications using Jenkins pipelines or freestyle jobs.

### Application Deployments:
- **Mini Calculator**: Deploys to `http://localhost:8080/userContent/minicalculator/index.html`
- **Student Management**: Deploys to `http://localhost:8080/userContent/studentmanagement/index.html`
