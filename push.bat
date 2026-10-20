@echo off
title Push to GitHub (lovebhak-create/MAPIA)
echo ==============================================
echo  Pushing 1930s Steam Train 3D to GitHub...
echo  Target: https://github.com/lovebhak-create/MAPIA.git
echo ==============================================
echo.
echo If a GitHub login window appears, please sign in with [lovebhak-create].
echo.
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ==============================================
    echo  SUCCESS! Push completed successfully!
    echo ==============================================
) else (
    echo [ERROR] Push failed. Please check your GitHub login or permissions.
)
pause
