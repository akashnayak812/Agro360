"""
Migration script to create MySQL database and tables for Agro360
Run this script once to set up your MySQL database
"""
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

def create_database():
    """Create the database if it doesn't exist"""
    try:
        # Connect to MySQL server (without specifying database)
        connection = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            port=int(os.getenv('MYSQL_PORT', 3306)),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', '')
        )
        
        cursor = connection.cursor()
        
        # Create database
        database_name = os.getenv('MYSQL_DATABASE', 'agro360')
        cursor.execute(f"CREATE DATABASE IF NOT EXISTS {database_name} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
        print(f"✅ Database '{database_name}' created successfully (or already exists)")
        
        cursor.close()
        connection.close()
        
    except mysql.connector.Error as e:
        print(f"❌ Error creating database: {e}")
        return False
    
    return True

def create_tables():
    """Create the users table"""
    try:
        # Connect to the database
        connection = mysql.connector.connect(
            host=os.getenv('MYSQL_HOST', 'localhost'),
            port=int(os.getenv('MYSQL_PORT', 3306)),
            user=os.getenv('MYSQL_USER', 'root'),
            password=os.getenv('MYSQL_PASSWORD', ''),
            database=os.getenv('MYSQL_DATABASE', 'agro360')
        )
        
        cursor = connection.cursor()
        
        # Create users table
        create_users_table = """
        CREATE TABLE IF NOT EXISTS users (
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
        """
        
        cursor.execute(create_users_table)
        print("✅ Users table created successfully (or already exists)")
        
        # Get table info
        cursor.execute("SELECT COUNT(*) FROM users")
        count = cursor.fetchone()[0]
        print(f"📊 Current users in database: {count}")
        
        cursor.close()
        connection.close()
        
    except mysql.connector.Error as e:
        print(f"❌ Error creating tables: {e}")
        return False
    
    return True

def migrate():
    """Run the complete migration"""
    print("=" * 50)
    print("🚀 Starting MySQL Database Migration for Agro360")
    print("=" * 50)
    print()
    
    # Check environment variables
    print("📋 Configuration:")
    print(f"   Host: {os.getenv('MYSQL_HOST', 'localhost')}")
    print(f"   Port: {os.getenv('MYSQL_PORT', '3306')}")
    print(f"   User: {os.getenv('MYSQL_USER', 'root')}")
    print(f"   Database: {os.getenv('MYSQL_DATABASE', 'agro360')}")
    print()
    
    # Create database
    print("1️⃣  Creating database...")
    if not create_database():
        return False
    print()
    
    # Create tables
    print("2️⃣  Creating tables...")
    if not create_tables():
        return False
    print()
    
    print("=" * 50)
    print("✨ Migration completed successfully!")
    print("=" * 50)
    print()
    print("Next steps:")
    print("1. Start your Flask application: python app.py")
    print("2. The database is ready to use!")
    print()
    
    return True

if __name__ == "__main__":
    try:
        migrate()
    except Exception as e:
        print(f"❌ Migration failed: {e}")
        exit(1)
