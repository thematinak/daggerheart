CREATE TABLE dh_backpack (
    id INT AUTO_INCREMENT PRIMARY KEY,

    character_id VARCHAR(50) NOT NULL,
    item_id VARCHAR(50) NOT NULL,

    quantity INT NOT NULL DEFAULT 1,

    CONSTRAINT fk_backpack_character
        FOREIGN KEY (character_id)
        REFERENCES dh_character(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_backpack_item
        FOREIGN KEY (item_id)
        REFERENCES dh_backpack_items(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);