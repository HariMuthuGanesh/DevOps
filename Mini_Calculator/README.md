# Mini Calculator Application

A modern, responsive, and feature-rich Mini Calculator web application built with **React** and **Vite**.

## Features
- **Standard & Scientific Modes**: Switch seamlessly between standard arithmetic and scientific functions (sin, cos, tan, log, ln, square root, powers, π, e).
- **Memory Operations**: Full support for `MC`, `MR`, `M+`, and `M-`.
- **Calculation History**: Log past calculations, clear history, or click any past result to reuse it.
- **Keyboard Support**: Complete keyboard shortcuts (Numbers, Operators, Enter, Backspace, Escape).
- **Modern Themes**: Support for Dark Obsidian, Cyberpunk Neon, and Minimalist Light themes.
- **Vite Production Build**: Compiles optimized static assets into the `dist/` directory.

---

## Jenkins Pipeline Setup (`Jenkinsfile`)

Below is the complete Declarative Jenkins Pipeline script for **Mini Calculator**:

```groovy
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
                bat 'npm install'
            }
        }
        stage('Build') {
            steps {
                bat 'npm run build'
            }
        }
        stage('Deploy') {
            steps {
                bat 'if not exist "C:\\ProgramData\\Jenkins\\.jenkins\\userContent\\minicalculator" mkdir "C:\\ProgramData\\Jenkins\\.jenkins\\userContent\\minicalculator"'
                bat 'xcopy /E /I /Y "dist\\*" "C:\\ProgramData\\Jenkins\\.jenkins\\userContent\\minicalculator\\"'
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
```

---

## Step 4: Run the Pipeline in Jenkins

1. Create a new **Pipeline** job in Jenkins (or configure an existing Pipeline job).
2. Under the **Pipeline** section in Jenkins configuration:
   - Select **Pipeline script** and paste the script above, OR
   - Select **Pipeline script from SCM**, choose **Git**, set Repository URL to `https://github.com/HariMuthuGanesh/DevOps.git`, Branch to `main`, and Script Path to `Mini_Calculator/Jenkinsfile`.
3. Save the pipeline configuration.
4. Click **Build Now**.
5. Jenkins will execute the pipeline stages:
   - **Checkout** → Pulls latest code from GitHub (`https://github.com/HariMuthuGanesh/DevOps.git`)
   - **Install dependencies** → Runs `npm install`
   - **Build** → Compiles optimized static assets (`npm run build`) into `dist/`
   - **Deploy** → Copies contents of `dist/` folder into `C:\ProgramData\Jenkins\.jenkins\userContent\minicalculator\`

---

## Step 5: Run / Preview Deployed Application

### Option A: Via Jenkins Hosted UserContent URL
Open your web browser and navigate to:
```
http://localhost:8080/userContent/minicalculator/index.html
```

### Option B: Run Locally with `serve`
1. Open **Command Prompt** or **PowerShell**.
2. Navigate to the deployed folder under Jenkins `userContent`:
   ```cmd
   cd C:\ProgramData\Jenkins\.jenkins\userContent\minicalculator
   ```
3. Start the static server (using `npx serve` or `http-server`):
   ```cmd
   npx serve -s . -l 3000
   ```
4. Access the web app in your browser at `http://localhost:3000`.

---

## Jenkins Freestyle Build Steps Configuration

For Jenkins Freestyle jobs, use the **Execute Windows batch command** step:

```cmd
call npm ci || call npm install
call npm run build
if not exist "C:\ProgramData\Jenkins\.jenkins\userContent\minicalculator" mkdir "C:\ProgramData\Jenkins\.jenkins\userContent\minicalculator"
xcopy /E /I /Y "dist\*" "C:\ProgramData\Jenkins\.jenkins\userContent\minicalculator\"
```

---

## Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production
npm run build
```
