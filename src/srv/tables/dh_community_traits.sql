CREATE TABLE `dh_community_traits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `community_id` varchar(50) NOT NULL,
  `trait` varchar(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_comm_trait_comm` (`community_id`),
  CONSTRAINT `fk_comm_trait_comm` FOREIGN KEY (`community_id`) REFERENCES `dh_communities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;