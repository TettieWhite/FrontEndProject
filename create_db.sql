CREATE DATABASE `cdd` /*!40100 DEFAULT CHARACTER SET utf8 */ /*!80016 DEFAULT ENCRYPTION='N' */;
CREATE TABLE `user` (
   `user_id` int NOT NULL AUTO_INCREMENT,
   `user_name` varchar(255) NOT NULL,
   `user_pass` varchar(255) NOT NULL,
   `user_email` varchar(255) NOT NULL,
   PRIMARY KEY (`user_id`)
 ) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;
CREATE TABLE `word` (
  `word_id` int NOT NULL AUTO_INCREMENT,
  `word` varchar(255) NOT NULL,
  `word_desc` varchar(255) NOT NULL,
  `create_date` varchar(255) NOT NULL,
  `vote_up` int NOT NULL DEFAULT '0',
  `deleted` tinyint(1) NOT NULL,
  `user_id` int DEFAULT NULL,
  `vote_down` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`word_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `word_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8;

 CREATE TABLE `vote` (
   `vote_id` int NOT NULL AUTO_INCREMENT,
   `vote_value` int NOT NULL,
   `user_id` int DEFAULT NULL,
   `word_id` int DEFAULT NULL,
   PRIMARY KEY (`vote_id`),
   KEY `user_id` (`user_id`),
   KEY `word_id` (`word_id`),
   CONSTRAINT `vote_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
   CONSTRAINT `vote_ibfk_2` FOREIGN KEY (`word_id`) REFERENCES `word` (`word_id`) ON DELETE SET NULL ON UPDATE CASCADE
 ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;
 CREATE TABLE `comment` (
   `comment_id` int NOT NULL AUTO_INCREMENT,
   `comment_desc` varchar(255) NOT NULL,
   `create_date` varchar(255) NOT NULL,
   `user_id` int DEFAULT NULL,
   `word_id` int DEFAULT NULL,
   PRIMARY KEY (`comment_id`),
   KEY `user_id` (`user_id`),
   KEY `word_id` (`word_id`),
   CONSTRAINT `comment_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE SET NULL ON UPDATE CASCADE,
   CONSTRAINT `comment_ibfk_2` FOREIGN KEY (`word_id`) REFERENCES `word` (`word_id`) ON DELETE SET NULL ON UPDATE CASCADE
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
 insert into user value (1, 'katrin1812', '$2b$10$.nO35dY.65dl4JppMQoIvOrSQWC8TyNjA8NOQ4D7zr1jBjo/4nByi', 'katrin1812@tut.by');
 insert into word values (1, 'appeal', 'a request to the public for money, information, or help', '2020-08-28', 0, 0, 1, 0), (3, 'after your own heart', 'having the same opinions or interests as you', '2020-08-28', 0, 0, 1, 0), (4, 'water under the bridge', 'problems that someone has had in the past that they do not worry about because they happened a long time ago and cannot now be changed', '2020-08-28', 0, 0, 1, 0), (6, 'establish', 'to start a company or organization that will continue for a long time', '2020-09-02', 0, 0, 1, 0);