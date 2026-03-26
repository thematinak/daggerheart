CREATE TABLE `dh_specialization_modifications` (
  `id` varchar(50) NOT NULL,
  `specialization_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `modifiers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`modifiers`)),
  PRIMARY KEY (`id`),
  KEY `fk_spec_mod_spec` (`specialization_id`),
  CONSTRAINT `fk_spec_mod_spec` FOREIGN KEY (`specialization_id`) REFERENCES `dh_specializations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;