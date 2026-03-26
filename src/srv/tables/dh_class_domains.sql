CREATE TABLE `dh_class_domains` (
  `class_id` varchar(50) NOT NULL,
  `domain_id` varchar(50) NOT NULL,
  PRIMARY KEY (`class_id`,`domain_id`),
  KEY `fk_domain` (`domain_id`),
  CONSTRAINT `fk_class` FOREIGN KEY (`class_id`) REFERENCES `dh_classes` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_domain` FOREIGN KEY (`domain_id`) REFERENCES `dh_domains` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;