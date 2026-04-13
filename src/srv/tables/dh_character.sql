CREATE TABLE dh_character (
    id VARCHAR(50) PRIMARY KEY,
    user_id INT NOT NULL,
    level INT NOT NULL DEFAULT 1,
    proficiency INT NOT NULL DEFAULT 1 CHECK (proficiency BETWEEN 1 AND 15),

    class_id VARCHAR(50),
    bank INT DEFAULT 0,

    specialization_id VARCHAR(50),
    ancestry_id VARCHAR(50),
    community_id VARCHAR(50),

    attributes JSON DEFAULT ('{}'),
    customAttributes JSON DEFAULT ('{}'),
    current_stats JSON DEFAULT ('{}'),
    experiences JSON DEFAULT ('[]'),
    leveling_data JSON DEFAULT ('{}'),

    name VARCHAR(50) NOT NULL,
    description VARCHAR(1000),

    -- Foreign keys
    CONSTRAINT fk_character_class
        FOREIGN KEY (class_id)
        REFERENCES dh_classes(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_character_specialization
        FOREIGN KEY (specialization_id)
        REFERENCES dh_specializations(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_character_ancestry
        FOREIGN KEY (ancestry_id)
        REFERENCES dh_ancestries(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    CONSTRAINT fk_character_community
        FOREIGN KEY (community_id)
        REFERENCES dh_communities(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
);
