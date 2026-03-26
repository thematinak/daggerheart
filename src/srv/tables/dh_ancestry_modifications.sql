CREATE TABLE `dh_ancestry_modifications` (
  `id` varchar(50) NOT NULL,
  `ancestry_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ancestry_mod_ancestry` (`ancestry_id`),
  CONSTRAINT `fk_ancestry_mod_ancestry` FOREIGN KEY (`ancestry_id`) REFERENCES `dh_ancestries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;