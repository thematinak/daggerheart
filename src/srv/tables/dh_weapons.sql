CREATE TABLE `dh_weapons` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `attribute` varchar(50) NOT NULL,
  `range_band` varchar(50) NOT NULL,
  `damage` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`damage`)),
  `burden` enum('one-handed','two-handed') NOT NULL,
  `tier` tinyint(4) NOT NULL,
  `slot` enum('primary','secondary') NOT NULL,
  `ability` varchar(100) DEFAULT NULL,
  `ability_description` text DEFAULT NULL,
  `modifiers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`modifiers`)),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;