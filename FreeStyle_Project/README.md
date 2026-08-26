# FreeStyle Project Automation

This directory documents and contains build scripts for **Jenkins Freestyle Jobs**.

## How to Configure a Jenkins Freestyle Job
1. **Source Code Management**:
   - Choose **Git**.
   - Repository URL: `https://github.com/HariMuthuGanesh/DevOps.git`
   - Branch: `*/main`
2. **Build Steps**:
   - Add build step: **Execute Windows batch command**.
   - Command:
     ```cmd
     call FreeStyle_Project\JENKINS_FREESTYLE_STEPS.bat
     ```
3. **Post-build Actions**:
   - Archive artifacts (optional): `Mini_Calculator/dist/**/*`

## Execution Output
The application dist files will automatically be published to Jenkins userContent directory:
`http://localhost:8080/userContent/minicalculator/index.html`
