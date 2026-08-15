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

## Jenkins Freestyle Build Steps Configuration

To automate the build and deployment of this application using Jenkins on Windows, add the following commands to the **Execute Windows batch command** build step in Jenkins:

```cmd
call npm ci || call npm install
call npm run build
mkdir "C:\ProgramData\Jenkins\.jenkins\userContent\minicalculator"
xcopy /E /I /Y "dist\*" "C:\ProgramData\Jenkins\.jenkins\userContent\minicalculator\"
```

### Breakdown of Commands:
1. `call npm ci || call npm install` → Installs project dependencies (`npm ci` is preferred for clean builds, falling back to `npm install`).
2. `call npm run build` → Runs Vite compiler to produce production-ready static assets in the `dist` folder.
3. `mkdir "C:\ProgramData\Jenkins\.jenkins\userContent\minicalculator"` → Creates the destination directory under Jenkins `userContent`.
4. `xcopy /E /I /Y "dist\*" "C:\ProgramData\Jenkins\.jenkins\userContent\minicalculator\"` → Recursively copies all compiled build files to Jenkins for hosting and deployment.

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
