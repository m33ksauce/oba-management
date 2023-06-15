-- Users

CREATE TABLE oba_admin.users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255),
    default_translation INTEGER,
    translations INTEGER[]
    
    CONSTRAINT
    CONSTRAINT fk_users_default_translation
        FOREIGN KEY(default_translation)
            REFERENCES oba_admin.translations(id)
)