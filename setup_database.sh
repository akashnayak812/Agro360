#!/bin/bash

echo "🌾 Agro360 Database Setup Script (MySQL) 🌾"
echo "=========================================="
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL is not installed or not in PATH"
    echo "Please install MySQL first:"
    echo "  macOS: brew install mysql"
    echo "  Ubuntu: sudo apt-get install mysql-server"
    echo ""
    exit 1
fi

# Check if MySQL is running
if pgrep -x "mysqld" > /dev/null; then
    echo "✅ MySQL is running"
else
    echo "⚠️  MySQL is not running"
    echo "Starting MySQL..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        brew services start mysql
    else
        sudo systemctl start mysql
    fi
fi

echo ""
echo "📦 Installing Backend Dependencies..."
cd backend
pip install -r requirements.txt

echo ""
echo "🔄 Running Database Migration..."
python migrate_users.py

echo ""
echo "📦 Installing Frontend Dependencies..."
cd ../frontend
npm install

echo ""
echo "✅ Setup Complete!"
echo ""
echo "📝 Next Steps:"
echo "1. Create backend/.env file with:"
echo "   SECRET_KEY=your-secret-key"
echo "   JWT_SECRET_KEY=your-jwt-secret-key"
echo "   MYSQL_HOST=localhost"
echo "   MYSQL_PORT=3306"
echo "   MYSQL_USER=root"
echo "   MYSQL_PASSWORD=your_password"
echo "   MYSQL_DATABASE=agro360"
echo ""
echo "2. Create frontend/.env file with:"
echo "   VITE_API_URL=http://localhost:5000"
echo ""
echo "3. Start the backend:"
echo "   cd backend && python app.py"
echo ""
echo "4. Start the frontend (in new terminal):"
echo "   cd frontend && npm run dev"
echo ""
echo "🎉 Happy farming! 🚜"
