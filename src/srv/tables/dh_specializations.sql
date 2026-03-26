CREATE TABLE `dh_specializations` (
  `id` varchar(50) NOT NULL,
  `class_id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_specialization_class` (`class_id`),
  CONSTRAINT `fk_specialization_class` FOREIGN KEY (`class_id`) REFERENCES `dh_classes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;