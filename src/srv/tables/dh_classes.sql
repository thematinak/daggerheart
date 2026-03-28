CREATE TABLE `dh_classes` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `base_hp` int(11) NOT NULL,
  `base_evasion` int(11) NOT NULL,
  `modifiers` varchar(1000) DEFAULT NULL,
  `hope_feature` varchar(100) NOT NULL,
  `hope_feature_description` text NOT NULL,
  `class_item` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_general_ci