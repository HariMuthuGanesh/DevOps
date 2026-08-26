@echo off
REM Jenkins Build & Deployment Script for Student Management App
echo [1/4] Navigating to Student_Management...
cd Student_Management

echo [2/4] Installing dependencies...
call npm install

echo [3/4] Building production app...
call npm run build

echo [4/4] Deploying artifacts to Jenkins userContent...
mkdir "C:\ProgramData\Jenkins\.jenkins\userContent\studentmanagement" 2>nul
xcopy /E /I /Y "dist\*" "C:\ProgramData\Jenkins\.jenkins\userContent\studentmanagement\"

echo Student Management Deployment completed successfully!
