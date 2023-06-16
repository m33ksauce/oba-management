-- Users

CREATE TABLE oba_admin.users (
    email VARCHAR(255) PRIMARY KEY,
    default_translation INTEGER,
    timezone VARCHAR(30),
    locale VARCHAR(10),
	
    CONSTRAINT fk_users_default_translation
        FOREIGN KEY(default_translation)
            REFERENCES oba_admin.translations(id)
);

CREATE TABLE oba_admin.translation_access (
    translation_id INTEGER,
    user_email VARCHAR(255),

    CONSTRAINT pk_translation_access
        PRIMARY KEY(translation_id, user_email),

    CONSTRAINT fk_translation_access_translationid
        FOREIGN KEY(translation_id)
            REFERENCES oba_admin.translations(id),

    CONSTRAINT fk_translation_access_useremail
        FOREIGN KEY(user_email)
            REFERENCES oba_admin.users(email)
);