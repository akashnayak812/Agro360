@echo off
echo ====================================
echo   Agro360 Database Setup (MySQL)
echo ====================================
echo.

echo Checking MySQL installation...
where mysql >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo WARNING: MySQL is not installed or not in PATH
    echo Please install MySQL first from https://dev.mysql.com/downloads/installer/
    echo.
    pause
    exit /b 1
)

echo Installing Backend Dependencies...
cd backend
pip install -r requirements.txt

echo.
echo Running Database Migration...
python migrate_users.py

echo.
echo Installing Frontend Dependencies...
cd ..\frontend
npm install

echo.
echo ====================================
echo Setup Complete!
echo ====================================
echo.
echo Next Steps:
echo 1. Create backend\.env file with:
echo    SECRET_KEY=your-secret-key
echo    JWT_SECRET_KEY=your-jwt-secret-key
echo    MYSQL_HOST=localhost
echo    MYSQL_PORT=3306
echo    MYSQL_USER=root
echo    MYSQL_PASSWORD=your_password
echo    MYSQL_DATABASE=agro360
echo.
echo 2. Create frontend\.env file with:
echo    VITE_API_URL=http://localhost:5000
echo.
echo 3. Ensure MySQL service is running
echo.
echo 4. Start the backend:
echo    cd backend ^&^& python app.py
echo.
echo 5. Start the frontend (in new terminal):
echo    cd frontend ^&^& npm run dev
echo.
echo Happy farming!
pause
