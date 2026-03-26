CREATE TABLE `dh_armor` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `tier` tinyint(4) NOT NULL CHECK (`tier` between 1 and 4),
  `threshold1` int(11) NOT NULL,
  `threshold2` int(11) NOT NULL,
  `baseScore` tinyint(4) NOT NULL CHECK (`baseScore` between 0 and 50),
  `modifiers` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL DEFAULT '{}' CHECK (json_valid(`modifiers`)),
  `ability` varchar(100) DEFAULT NULL,
  `abilityDescription` text DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci;