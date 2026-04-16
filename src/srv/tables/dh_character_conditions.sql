CREATE TABLE `dh_character_conditions` (
  `character_id` varchar(50) NOT NULL,
  `condition_id` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`character_id`, `condition_id`),
  KEY `idx_character_conditions_condition_id` (`condition_id`),
  CONSTRAINT `fk_character_conditions_character`
    FOREIGN KEY (`character_id`) REFERENCES `dh_character` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_character_conditions_condition`
    FOREIGN KEY (`condition_id`) REFERENCES `dh_conditions` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;
