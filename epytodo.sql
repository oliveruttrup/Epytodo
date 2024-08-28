CREATE DATABASE IF NOT EXISTS epytodo;

USE epytodo;

-- case where table already exists
-- check if colums already exists / or new columns added
DROP TABLE IF EXISTS user;
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    firstname VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS todo;
CREATE TABLE todo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    due_time DATETIME NOT NULL,
    user_id INT NOT NULL,
    status ENUM('not started', 'todo', 'in progress', 'done') DEFAULT 'not started',
    FOREIGN KEY (user_id) REFERENCES user(id)
);
