CREATE DATABASE IF NOT EXISTS giftmoment;
USE giftmoment;

CREATE TABLE IF NOT EXISTS members (
  id INT AUTO_INCREMENT PRIMARY KEY,
  kakao_id VARCHAR(100) UNIQUE NOT NULL,
  email VARCHAR(255),
  name VARCHAR(100),
  birth_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gifts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  member_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  link VARCHAR(500),
  price INT NOT NULL DEFAULT 0,
  target_amount INT NOT NULL DEFAULT 0,
  current_amount INT NOT NULL DEFAULT 0,
  image_url VARCHAR(500),
  status ENUM('active', 'completed', 'expired') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS letters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  gift_id INT NOT NULL,
  unique_string VARCHAR(64) NOT NULL,
  sender_name VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  amount INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (gift_id) REFERENCES gifts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_letters_unique ON letters(unique_string);
CREATE INDEX IF NOT EXISTS idx_gifts_member ON gifts(member_id);
