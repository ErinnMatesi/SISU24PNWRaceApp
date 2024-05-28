-- MySQL dump 10.13  Distrib 8.3.0, for Win64 (x86_64)
--
-- Host: localhost    Database: raceeventapp
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `bonusobjectives`
--

DROP TABLE IF EXISTS `bonusobjectives`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bonusobjectives` (
  `ObjectiveID` int NOT NULL AUTO_INCREMENT,
  `Description` text,
  `AssociatedTrailID` int DEFAULT NULL,
  `BonusPoints` int DEFAULT NULL,
  PRIMARY KEY (`ObjectiveID`),
  KEY `AssociatedTrailID` (`AssociatedTrailID`),
  CONSTRAINT `bonusobjectives_ibfk_1` FOREIGN KEY (`AssociatedTrailID`) REFERENCES `trails` (`TrailID`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `raceentries`
--

DROP TABLE IF EXISTS `raceentries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `raceentries` (
  `EntryID` int NOT NULL AUTO_INCREMENT,
  `RacerID` int NOT NULL,
  `TrailID` int DEFAULT NULL,
  `StartTime` datetime DEFAULT NULL,
  `EndTime` datetime DEFAULT NULL,
  `PointsEarned` int DEFAULT NULL,
  `BonusPointsEarned` int DEFAULT NULL,
  `BonusObjectiveID` int DEFAULT NULL,
  `BonusObjectiveDescription` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`EntryID`),
  KEY `RacerID` (`RacerID`),
  KEY `TrailID` (`TrailID`),
  KEY `fk_bonus_objective` (`BonusObjectiveID`),
  CONSTRAINT `fk_bonus_objective` FOREIGN KEY (`BonusObjectiveID`) REFERENCES `bonusobjectives` (`ObjectiveID`),
  CONSTRAINT `raceentries_ibfk_1` FOREIGN KEY (`RacerID`) REFERENCES `racers` (`RacerID`),
  CONSTRAINT `raceentries_ibfk_2` FOREIGN KEY (`TrailID`) REFERENCES `trails` (`TrailID`)
) ENGINE=InnoDB AUTO_INCREMENT=42 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `racers`
--

DROP TABLE IF EXISTS `racers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `racers` (
  `RacerID` int NOT NULL AUTO_INCREMENT,
  `Gender` enum('Male','Female','Nonbinary') NOT NULL,
  `Age` int DEFAULT NULL,
  `BibNumber` int NOT NULL,
  `Division` enum('100 milers','24hr individual','24hr team') NOT NULL,
  `TeamID` int DEFAULT NULL,
  `FirstName` varchar(255) DEFAULT NULL,
  `LastName` varchar(255) DEFAULT NULL,
  `TotalMiles` decimal(5,2) DEFAULT '0.00',
  `TotalElevationGain` int DEFAULT '0',
  `TotalPoints` int DEFAULT '0',
  PRIMARY KEY (`RacerID`),
  KEY `TeamID` (`TeamID`),
  CONSTRAINT `racers_ibfk_1` FOREIGN KEY (`TeamID`) REFERENCES `teams` (`TeamID`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `racertrailmap`
--

DROP TABLE IF EXISTS `racertrailmap`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `racertrailmap` (
  `ID` int NOT NULL AUTO_INCREMENT,
  `RacerID` int NOT NULL,
  `TrailID` int NOT NULL,
  PRIMARY KEY (`ID`),
  UNIQUE KEY `RacerID` (`RacerID`,`TrailID`),
  KEY `TrailID` (`TrailID`),
  CONSTRAINT `racertrailmap_ibfk_1` FOREIGN KEY (`RacerID`) REFERENCES `racers` (`RacerID`),
  CONSTRAINT `racertrailmap_ibfk_2` FOREIGN KEY (`TrailID`) REFERENCES `trails` (`TrailID`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `teams`
--

DROP TABLE IF EXISTS `teams`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teams` (
  `TeamID` int NOT NULL AUTO_INCREMENT,
  `TeamName` varchar(255) NOT NULL,
  `TotalPoints` int DEFAULT '0',
  PRIMARY KEY (`TeamID`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `trails`
--

DROP TABLE IF EXISTS `trails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trails` (
  `TrailID` int NOT NULL AUTO_INCREMENT,
  `TrailName` varchar(255) NOT NULL,
  `Distance` decimal(5,2) NOT NULL,
  `ElevationGain` int NOT NULL,
  `BasePoints` int NOT NULL,
  `FirstTenPoints` int DEFAULT NULL,
  `SecondTenPoints` int DEFAULT NULL,
  PRIMARY KEY (`TrailID`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-05-27 18:34:18
