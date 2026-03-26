CREATE TABLE `dh_domain_cards` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `domain_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` varchar(100) NOT NULL,
  `level` tinyint(4) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `domain_id` (`domain_id`),
  CONSTRAINT `dh_domain_cards_ibfk_1` FOREIGN KEY (`domain_id`) REFERENCES `dh_domains` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci