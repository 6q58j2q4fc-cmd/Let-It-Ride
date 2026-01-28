#!/usr/bin/env node
/**
 * Admin Account Seed Script
 * Creates the first admin account for the Let It Ride admin panel
 * 
 * Usage: node scripts/seed-admin.mjs
 * 
 * Default credentials (change after first login):
 * Username: admin
 * Password: LetItRide2024!
 */

import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Try to load .env file if it exists
try {
  const envPath = join(__dirname, '..', '.env');
  dotenv.config({ path: envPath });
} catch (e) {
  // .env file may not exist in production
}

const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'LetItRide2024!',
  displayName: 'Site Administrator',
  email: 'admin@letitridebend.com'
};

async function seedAdmin() {
  console.log('🔧 Admin Account Seed Script');
  console.log('============================\n');

  const databaseUrl = process.env.DATABASE_URL;
  
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set');
    console.log('\nPlease ensure DATABASE_URL is set in your environment or .env file');
    process.exit(1);
  }

  let connection;
  
  try {
    // Parse the database URL
    const url = new URL(databaseUrl);
    const config = {
      host: url.hostname,
      port: parseInt(url.port) || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: { rejectUnauthorized: false }
    };

    console.log(`📡 Connecting to database at ${config.host}...`);
    connection = await mysql.createConnection(config);
    console.log('✅ Connected to database\n');

    // Check if admin_credentials table exists
    console.log('🔍 Checking for admin_credentials table...');
    const [tables] = await connection.query(
      "SHOW TABLES LIKE 'admin_credentials'"
    );

    if (tables.length === 0) {
      console.log('📝 Creating admin_credentials table...');
      await connection.query(`
        CREATE TABLE admin_credentials (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(100) NOT NULL UNIQUE,
          passwordHash VARCHAR(255) NOT NULL,
          displayName VARCHAR(255),
          email VARCHAR(320),
          isActive BOOLEAN DEFAULT TRUE NOT NULL,
          lastLoginAt DATETIME,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP NOT NULL
        )
      `);
      console.log('✅ Table created\n');
    } else {
      console.log('✅ Table already exists\n');
    }

    // Check if admin already exists
    console.log(`🔍 Checking if admin user "${DEFAULT_ADMIN.username}" exists...`);
    const [existingAdmins] = await connection.query(
      'SELECT id, username FROM admin_credentials WHERE username = ?',
      [DEFAULT_ADMIN.username]
    );

    if (existingAdmins.length > 0) {
      console.log(`⚠️  Admin user "${DEFAULT_ADMIN.username}" already exists (ID: ${existingAdmins[0].id})`);
      console.log('\nTo reset the password, you can run:');
      console.log('  node scripts/reset-admin-password.mjs\n');
      
      // Ask if they want to reset the password
      const readline = await import('readline');
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        rl.question('Do you want to reset the admin password? (y/N): ', resolve);
      });
      rl.close();

      if (answer.toLowerCase() === 'y') {
        const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
        await connection.query(
          'UPDATE admin_credentials SET passwordHash = ?, updatedAt = NOW() WHERE username = ?',
          [passwordHash, DEFAULT_ADMIN.username]
        );
        console.log('\n✅ Password has been reset to the default');
      } else {
        console.log('\n👍 No changes made');
      }
    } else {
      // Create the admin account
      console.log('📝 Creating admin account...');
      const passwordHash = await bcrypt.hash(DEFAULT_ADMIN.password, 10);
      
      await connection.query(
        `INSERT INTO admin_credentials (username, passwordHash, displayName, email, isActive)
         VALUES (?, ?, ?, ?, TRUE)`,
        [DEFAULT_ADMIN.username, passwordHash, DEFAULT_ADMIN.displayName, DEFAULT_ADMIN.email]
      );

      console.log('\n✅ Admin account created successfully!\n');
    }

    // Display login information
    console.log('============================');
    console.log('🔐 Admin Login Credentials');
    console.log('============================');
    console.log(`   URL:      /admin-login`);
    console.log(`   Username: ${DEFAULT_ADMIN.username}`);
    console.log(`   Password: ${DEFAULT_ADMIN.password}`);
    console.log('============================\n');
    console.log('⚠️  IMPORTANT: Change your password after first login!');
    console.log('   Go to Admin Panel → Settings to update your credentials.\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\nCould not connect to the database. Please check:');
      console.log('  1. The database server is running');
      console.log('  2. DATABASE_URL is correct');
      console.log('  3. Network/firewall settings allow the connection');
    }
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('📡 Database connection closed');
    }
  }
}

// Run the seed script
seedAdmin().catch(console.error);
