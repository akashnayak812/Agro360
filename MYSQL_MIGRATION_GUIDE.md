# MySQL Migration Guide - Quick Reference

## 🔄 Changed from MongoDB to MySQL

### What Changed

| Component | Before (MongoDB) | After (MySQL) |
|-----------|-----------------|---------------|
| **Database** | MongoDB NoSQL | MySQL Relational |
| **Python Library** | pymongo | flask-sqlalchemy, mysql-connector-python |
| **ORM** | None (Direct PyMongo) | SQLAlchemy |
| **Connection** | MongoClient | SQLAlchemy engine |
| **User ID** | ObjectId (string) | Auto-increment INT |
| **Collections** | users collection | users table |
| **Data Storage** | Native BSON | JSON in TEXT fields |

---

## 📋 Configuration Changes

### Old `.env` (MongoDB)
```env
MONGO_URI=mongodb://localhost:27017/agro360
```

### New `.env` (MySQL)
```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=agro360
```

---

## 🗄️ Database Schema

### MySQL Table Structure
```sql
users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'farmer',
    personal_info TEXT,           -- JSON stored as text
    recent_searches TEXT,          -- JSON array as text
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

---

## 🔧 Code Changes Summary

### 1. User Model (`models/user.py`)
- Changed from MongoDB document to SQLAlchemy model
- Uses ORM methods: `query.filter_by()`, `session.add()`, `session.commit()`
- JSON fields stored as TEXT with `json.dumps()/json.loads()`

### 2. App Configuration (`app.py`)
```python
# Old
from pymongo import MongoClient
client = MongoClient(app.config['MONGO_URI'])
db = client.get_database()

# New
from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy(app)
```

### 3. Auth Routes (`routes/auth_routes.py`)
```python
# Old
user['_id']          # MongoDB ObjectId
user['password']     # Dict access

# New
user.id              # SQLAlchemy attribute
user.password        # Object property
```

---

## 🚀 Migration Steps

1. **Install MySQL**
   ```bash
   # macOS
   brew install mysql
   brew services start mysql
   
   # Ubuntu
   sudo apt install mysql-server
   sudo systemctl start mysql
   ```

2. **Update Dependencies**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

3. **Configure Environment**
   - Update `backend/.env` with MySQL credentials

4. **Run Migration**
   ```bash
   cd backend
   python migrate_users.py
   ```

5. **Start Application**
   ```bash
   python app.py
   ```

---

## 💾 Data Migration (If You Have Existing MongoDB Data)

If you had users in MongoDB and want to migrate to MySQL:

```python
# migration_from_mongo.py
import pymongo
import mysql.connector
import json
from datetime import datetime

# Connect to MongoDB
mongo_client = pymongo.MongoClient('mongodb://localhost:27017/')
mongo_db = mongo_client['agro360']

# Connect to MySQL
mysql_conn = mysql.connector.connect(
    host='localhost',
    user='root',
    password='your_password',
    database='agro360'
)
cursor = mysql_conn.cursor()

# Migrate users
for user in mongo_db.users.find():
    cursor.execute("""
        INSERT INTO users (email, password, name, role, personal_info, recent_searches, created_at, updated_at)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    """, (
        user['email'],
        user['password'],
        user['name'],
        user.get('role', 'farmer'),
        json.dumps(user.get('personal_info', {})),
        json.dumps(user.get('recent_searches', [])),
        user.get('created_at', datetime.utcnow()),
        user.get('updated_at', datetime.utcnow())
    ))

mysql_conn.commit()
print(f"Migrated {cursor.rowcount} users")
```

---

## 🔍 Useful MySQL Commands

### Check Database
```sql
USE agro360;
SHOW TABLES;
DESCRIBE users;
```

### View Users
```sql
SELECT id, email, name, role, created_at FROM users;
```

### Count Users
```sql
SELECT COUNT(*) FROM users;
```

### View Recent Search for User
```sql
SELECT recent_searches FROM users WHERE id = 1;
```

### Clear All Recent Searches
```sql
UPDATE users SET recent_searches = '[]';
```

---

## ✅ Benefits of MySQL Over MongoDB

1. **ACID Transactions** - Data consistency guaranteed
2. **Relationships** - Easy foreign keys for future tables (farms, crops)
3. **SQL Standard** - Universal query language
4. **Hosting** - More hosting options (shared hosting, etc.)
5. **Tools** - phpMyAdmin, MySQL Workbench, etc.
6. **Performance** - Optimized for structured data

---

## 🆘 Common Issues

### Issue: Can't connect to MySQL
**Solution:**
```bash
# Check MySQL status
sudo systemctl status mysql

# Start MySQL
sudo systemctl start mysql
```

### Issue: Access denied for user
**Solution:**
```sql
GRANT ALL PRIVILEGES ON agro360.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
```

### Issue: SQLAlchemy errors
**Solution:**
```bash
pip install --upgrade flask-sqlalchemy mysql-connector-python pymysql
```

---

## 📚 Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Flask-SQLAlchemy](https://flask-sqlalchemy.palletsprojects.com/)

---

**✨ Your application is now using MySQL for robust, relational data storage!**
