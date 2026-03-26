CREATE TABLE `dh_community_modifications` (
  `id` varchar(50) NOT NULL,
  `community_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_comm_mod_comm` (`community_id`),
  CONSTRAINT `fk_comm_mod_comm` FOREIGN KEY (`community_id`) REFERENCES `dh_communities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;