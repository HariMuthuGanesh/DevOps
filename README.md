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

## 🧪 Experiment 1: GitHub Commands & Minimum React Application

### Overview
Construct a functional React frontend application, initialize Git version control, and push all project directories cleanly to GitHub without duplicate root files.

### 1. Key GitHub Commands Used
```bash
# Check repository status
git status

# Add files to staging area
git add .

# Commit changes with descriptive message
git commit -m "Clean duplicate root files, add Backend API and Freestyle project structures, update Jenkins automation and lab documentation"

# Verify commit history
git log --oneline -n 5

# Push changes to remote main branch
git push origin main
```

### 2. React Application (`Mini_Calculator`)
- **Technology Stack**: React 19, Vite, Lucide Icons.
- **Local Run Instructions**:
  ```bash
  cd Mini_Calculator
  npm install
  npm run dev
  ```
- **Build Production Artifacts**:
  ```bash
  npm run build
  ```
  *(Generates `dist/` directory containing production bundle)*

---

## 🧪 Experiment 2: Jenkins CI/CD Automation

### Overview
Automate the build, testing, and deployment of the React application (`Mini_Calculator`) using Jenkins.

### Option A: Declarative Pipeline (`Jenkinsfile`)
1. Create a **Pipeline** job in Jenkins.
2. Select **Pipeline script from SCM**.
3. Set SCM to **Git** with repository URL: `https://github.com/HariMuthuGanesh/DevOps.git`.
4. Script Path: `Jenkinsfile`.

#### Pipeline Stages:
- **Checkout**: Pulls latest code from `origin/main`.
- **Install dependencies**: Runs `npm install` inside `Mini_Calculator`.
- **Build**: Compiles production bundle with `npm run build`.
- **Deploy**: Copies `dist/*` output into Jenkins static server directory (`C:\ProgramData\Jenkins\.jenkins\userContent\minicalculator`).

### Option B: Freestyle Job Setup
1. Create a **Freestyle project** in Jenkins.
2. Under **Build Steps**, add **Execute Windows batch command**:
   ```cmd
   call FreeStyle_Project\JENKINS_FREESTYLE_STEPS.bat
   ```
3. Save and click **Build Now**.

---

## 🚀 Deployed Application Access
Once Jenkins completes the build, access the deployed application at:
`http://localhost:8080/userContent/minicalculator/index.html`
