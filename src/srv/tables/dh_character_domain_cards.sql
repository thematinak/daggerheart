CREATE TABLE dh_character_domain_cards (
    character_id VARCHAR(50) NOT NULL,
    domain_card_id int(11) NOT NULL,

    PRIMARY KEY (character_id, domain_card_id),

    CONSTRAINT fk_char_domain_character
        FOREIGN KEY (character_id)
        REFERENCES dh_character(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT fk_char_domain_card
        FOREIGN KEY (domain_card_id)
        REFERENCES dh_domain_cards(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE

) ENGINE=InnoDB
CHARSET=utf8mb3
COLLATE=utf8mb3_general_ci;