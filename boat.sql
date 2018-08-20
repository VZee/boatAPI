-- Louisa Katlubeck
-- MySQL file for boat and slip API
--
-- Use schema
USE boat_slip;
--
-- --------------------------------------------------------------
-- Create tables
-- --------------------------------------------------------------
-- Table structure for table `boat`
--
DROP TABLE IF EXISTS `boat`;
CREATE TABLE `boat`(
	`boat_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    `name` varchar(255) NOT NULL UNIQUE,
    `type` varchar(255) NOT NULL,
	`length` int(11) NOT NULL,
    `at_sea` boolean NOT NULL DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
--
--
-- Table structure for table `slip`
--
DROP TABLE IF EXISTS `slip`;
CREATE TABLE `slip`(
	`slip_id` int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	`number` int(11) NOT NULL UNIQUE,
    `current_boat` int(11) DEFAULT NULL,
    `arrival_date` date DEFAULT NULL
)ENGINE=InnoDB DEFAULT CHARSET=latin1;
--
-- Constraints for table `slip`
ALTER TABLE `slip`
ADD CONSTRAINT `slip_ibfk_1` FOREIGN KEY (`current_boat`) 
REFERENCES `boat` (`boat_id`)
ON DELETE SET NULL;