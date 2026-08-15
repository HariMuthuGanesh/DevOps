@echo off
REM Jenkins Freestyle Build & Deployment Script for Mini Calculator App

echo [1/4] Installing dependencies...
call npm ci || call npm install

echo [2/4] Building production-ready bundle...
call npm run build

echo [3/4] Creating target directory in Jenkins userContent...
mkdir "C:\ProgramData\Jenkins\.jenkins\userContent\minicalculator" 2>nul

echo [4/4] Copying build artifacts to Jenkins userContent...
xcopy /E /I /Y "dist\*" "C:\ProgramData\Jenkins\.jenkins\userContent\minicalculator\"

echo Jenkins deployment completed successfully!
