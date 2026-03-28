CREATE TABLE `dh_backpack_items` (
  `id` VARCHAR(50) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `modifiers` JSON NOT NULL DEFAULT '{}',
  `roll` INT NOT NULL,
  `type` ENUM('loot','consumables') NOT NULL DEFAULT 'loot',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB 
DEFAULT CHARSET=utf8mb4 
COLLATE=utf8mb4_general_ci;