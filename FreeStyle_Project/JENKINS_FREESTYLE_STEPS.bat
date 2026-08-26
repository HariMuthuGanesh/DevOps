@echo off
REM Jenkins Freestyle Project Build Script
echo [1/3] Navigating to Mini Calculator Directory...
cd Mini_Calculator

echo [2/3] Installing Dependencies and Building Application...
call npm install
call npm run build

echo [3/3] Deploying Artifacts...
mkdir "C:\ProgramData\Jenkins\.jenkins\userContent\minicalculator" 2>nul
xcopy /E /I /Y "dist\*" "C:\ProgramData\Jenkins\.jenkins\userContent\minicalculator\"

echo Freestyle Build and Deployment Completed!
