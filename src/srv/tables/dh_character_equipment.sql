CREATE TABLE dh_character_equipment (
    id INT AUTO_INCREMENT PRIMARY KEY,

    character_id VARCHAR(50) NOT NULL,

    weapon_id VARCHAR(50) NULL,
    armor_id VARCHAR(50) NULL,

    is_equipped BOOLEAN NOT NULL DEFAULT FALSE,

    CONSTRAINT fk_equipment_character
        FOREIGN KEY (character_id)
        REFERENCES dh_character(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_equipment_weapon
        FOREIGN KEY (weapon_id)
        REFERENCES dh_weapons(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_equipment_armor
        FOREIGN KEY (armor_id)
        REFERENCES dh_armor(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

) CHARSET=utf8mb3;