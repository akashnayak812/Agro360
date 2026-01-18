"""
Alternative migration script using root without password
"""
import subprocess
import os

def run_mysql_command(command):
    """Run MySQL command directly"""
    try:
        result = subprocess.run(
            ['mysql', '-u', 'root'],
            input=command.encode(),
            capture_output=True,
            text=False
        )
        return result.returncode == 0, result.stdout.decode(), result.stderr.decode()
    except Exception as e:
        return False, "", str(e)

def migrate():
    print("=" * 50)
    print("🚀 MySQL Database Setup for Agro360")
    print("=" * 50)
    print()
    
    # Try to create database
    commands = [
        "CREATE DATABASE IF NOT EXISTS agro360 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
        """USE agro360;
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
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"""
    ]
    
    for cmd in commands:
        success, stdout, stderr = run_mysql_command(cmd)
        if not success:
            print(f"❌ Error: {stderr}")
            print("\n⚠️  MySQL requires authentication.")
            print("\nPlease run these commands manually in MySQL:")
            print("\n1. Connect to MySQL: mysql -u root -p")
            print("2. Enter your MySQL root password")
            print("3. Run these commands:")
            print("\n   CREATE DATABASE IF NOT EXISTS agro360 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
            print("   USE agro360;")
            print("   CREATE TABLE IF NOT EXISTS users (")
            print("       id INT AUTO_INCREMENT PRIMARY KEY,")
            print("       email VARCHAR(255) UNIQUE NOT NULL,")
            print("       password VARCHAR(255) NOT NULL,")
            print("       name VARCHAR(255) NOT NULL,")
            print("       role VARCHAR(50) DEFAULT 'farmer',")
            print("       personal_info TEXT,")
            print("       recent_searches TEXT,")
            print("       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,")
            print("       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,")
            print("       INDEX idx_email (email),")
            print("       INDEX idx_created_at (created_at)")
            print("   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;")
            print("\n4. Update backend/.env with your MySQL password:")
            print("   MYSQL_PASSWORD=your_mysql_password")
            return False
    
    print("✅ Database and tables created successfully!")
    print("\n📝 Update backend/.env with your MySQL password if needed")
    return True

if __name__ == "__main__":
    migrate()
