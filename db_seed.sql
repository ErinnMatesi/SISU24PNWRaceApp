-- Create Database
CREATE DATABASE IF NOT EXISTS RaceEventApp;
USE RaceEventApp;

-- Create Teams Table
CREATE TABLE IF NOT EXISTS Teams (
    TeamID INT AUTO_INCREMENT PRIMARY KEY,
    TeamName VARCHAR(255) NOT NULL
);

-- Create Trails Table
CREATE TABLE IF NOT EXISTS Trails (
    TrailID INT AUTO_INCREMENT PRIMARY KEY,
    TrailName VARCHAR(255) NOT NULL,
    Distance DECIMAL(5,2) NOT NULL,
    ElevationGain INT NOT NULL,
    BasePoints INT NOT NULL
);

-- Create Racers Table
CREATE TABLE IF NOT EXISTS Racers (
    RacerID INT AUTO_INCREMENT PRIMARY KEY,
    FullName VARCHAR(255) NOT NULL,
    Gender ENUM('Male', 'Female', 'Nonbinary') NOT NULL,
    Age INT,
    BibNumber INT NOT NULL,
    Division ENUM('100 milers', '24hr individual', '24hr team') NOT NULL,
    TeamID INT,
    FOREIGN KEY (TeamID) REFERENCES Teams(TeamID)
);

-- Create Race Entries Table
CREATE TABLE IF NOT EXISTS RaceEntries (
    EntryID INT AUTO_INCREMENT PRIMARY KEY,
    RacerID INT NOT NULL,
    TrailID INT NOT NULL,
    StartTime DATETIME,
    EndTime DATETIME,
    PointsEarned INT,
    BonusPointsEarned INT,
    FOREIGN KEY (RacerID) REFERENCES Racers(RacerID),
    FOREIGN KEY (TrailID) REFERENCES Trails(TrailID)
);

-- Create Bonus Objectives Table
CREATE TABLE IF NOT EXISTS BonusObjectives (
    ObjectiveID INT AUTO_INCREMENT PRIMARY KEY,
    Description TEXT,
    AssociatedTrailID INT,
    BonusPoints INT,
    FOREIGN KEY (AssociatedTrailID) REFERENCES Trails(TrailID)
);

-- Create Race Results Table
CREATE TABLE IF NOT EXISTS RaceResults (
    ResultID INT AUTO_INCREMENT PRIMARY KEY,
    RacerTeamID INT NOT NULL,
    TotalMilesRan DECIMAL(5,2),
    TotalElevationGained INT,
    TotalPoints INT,
    Division ENUM('100 milers', '24hr individual', '24hr team') NOT NULL,
    AveragePace DECIMAL(5,2),
    FOREIGN KEY (RacerTeamID) REFERENCES Racers(RacerID),
    FOREIGN KEY (RacerTeamID) REFERENCES Teams(TeamID)
);
