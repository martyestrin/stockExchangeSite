DROP DATABASE IF EXISTS UsersDB;
CREATE DATABASE UsersDB;
USE UsersDB;

CREATE TABLE UserAccounts (
    studentID INT AUTO_INCREMENT,
    email VARCHAR(50) NOT NULL,
    pwd VARCHAR(255) NOT NULL,
    username VARCHAR(50) NOT NULL,
    Balance INT DEFAULT 50000,
    PRIMARY KEY (studentID),
    UNIQUE (email),
    UNIQUE (username)
);

CREATE TABLE UserTrades (
	studentID INT,
    ticker VARCHAR(100),
    companyName VARCHAR(200),
    quantity INT,
    totalCost DECIMAL(10,2),
    FOREIGN KEY (studentID) REFERENCES UserAccounts(studentID)
        ON DELETE CASCADE ON UPDATE CASCADE
);
