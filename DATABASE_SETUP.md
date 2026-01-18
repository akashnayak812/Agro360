# Database Setup Guide - Agro360 (MySQL)

## Overview
Agro360 uses MySQL database for storing:
- User login credentials (hashed passwords)
- Personal information (farm details, contact info)
- Recent searches (up to 10 per user)

## Prerequisites
- MySQL 5.7+ or MySQL 8.0+ installed
- Python 3.8+
- Node.js 16+

## Backend Setup

### 1. MySQL Installation

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

**Windows:**
Download and install from [MySQL Downloads](https://dev.mysql.com/downloads/installer/)

### 2. MySQL Configuration

Create a `.env` file in the `/backend` directory:

```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here

# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=agro360
```

### 3. Create MySQL Database (Optional - migration script does this)

```sql
CREATE DATABASE agro360 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 5. Run Migration Script

```bash
cd backend
python migrate_users.py
```

### 6. Database Schema

#### **users** table
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'farmer',
    personal_info TEXT,
    recent_searches TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Field Details:**
- `personal_info`: JSON string containing user's farm details
- `recent_searches`: JSON array of recent searches (max 10)
- Indexes on `email` and `created_at` for faster queries

## Frontend Setup

### 1. Environment Variables

Create a `.env` file in the `/frontend` directory:

```env
VITE_API_URL=http://localhost:5000
```

### 2. Install Dependencies

```bash
cd frontend
npm install
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user profile

### Personal Information
- `PUT /api/auth/personal-info` - Update personal information

### Recent Searches
- `POST /api/auth/recent-searches` - Add a search to history
- `GET /api/auth/recent-searches` - Get user's recent searches
- `DELETE /api/auth/recent-searches` - Clear all recent searches

## Usage Examples

### Register a New User
```javascript
const response = await fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Farmer',
    email: 'john@example.com',
    password: 'secure123'
  })
});
```

### Update Personal Information
```javascript
const response = await fetch('http://localhost:5000/api/auth/personal-info', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    phone: '+91 9876543210',
    farm_size: '10',
    crops_grown: ['Rice', 'Wheat'],
    soil_type: 'loamy'
  })
});
```

### Track a Search
```javascript
import { trackSearch, SEARCH_TYPES } from './lib/searchTracker';

// After a crop recommendation
await trackSearch(
  token,
  SEARCH_TYPES.CROP,
  { nitrogen: 90, phosphorus: 42, potassium: 43 },
  'Rice recommended'
);
```

## Security Features

1. **Password Hashing**: All passwords are hashed using bcrypt
2. **JWT Authentication**: Secure token-based authentication
3. **Environment Variables**: Sensitive data stored in .env files
4. **CORS Protection**: Configured for specific origins only
5. **Indexed Queries**: Fast lookups with database indexes

## Troubleshooting

### Cannot connect to MySQL
```bash
# Check if MySQL is running
sudo systemctl status mysql  # Linux
brew services list | grep mysql  # macOS

# Start MySQL
sudo systemctl start mysql  # Linux
brew services start mysql  # macOS
```

### Authentication fails
- Clear browser localStorage
- Verify JWT_SECRET_KEY is set in .env
- Check token expiration (default: 24 hours)

### Migration errors
- Verify MySQL credentials in .env
- Ensure MySQL service is running
- Check database user permissions:
```sql
GRANT ALL PRIVILEGES ON agro360.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

## Running the Application

### Start Backend
```bash
cd backend
python app.py
```

### Start Frontend
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## MySQL Best Practices

### Backup Database
```bash
mysqldump -u root -p agro360 > backup.sql
```

### Restore Database
```bash
mysql -u root -p agro360 < backup.sql
```

### View Users
```sql
USE agro360;
SELECT id, email, name, role, created_at FROM users;
```

### Clear Recent Searches for All Users
```sql
UPDATE users SET recent_searches = '[]';
```

## Performance Optimization

1. **Indexes**: Already created on `email` and `created_at`
2. **Connection Pooling**: SQLAlchemy handles this automatically
3. **JSON Fields**: Using TEXT with JSON for flexibility

## Support

For issues or questions:
1. Check backend logs for errors
2. Verify MySQL connection with `mysql -u root -p`
3. Ensure all dependencies are installed
4. Check .env configuration
5. Review MySQL error logs: `/var/log/mysql/error.log`
