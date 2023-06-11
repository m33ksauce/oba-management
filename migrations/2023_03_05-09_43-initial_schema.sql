--
--

-- create schema
CREATE SCHEMA oba_admin;

-- translations table
CREATE TABLE oba_admin.translations (
    id SERIAL PRIMARY KEY,
    translation varchar(25) NOT NULL,
    settings_object json NOT NULL,
    UNIQUE(translation)
);

-- translations_settings table
CREATE TABLE oba_admin.translation_settings (
    translation_id INTEGER PRIMARY KEY,
    settings_object json NOT NULL
    CONSTRAINT fk_translation
        FOREIGN KEY(translation_id)
            REFERENCES oba_admin.translations(id)
);

-- categories table
CREATE TABLE oba_admin.categories (
    id UUID NOT NULL PRIMARY KEY,
    parent_id UUID,
    name TEXT NOT NULL,
    translation_id INTEGER,
    CONSTRAINT fk_translation
        FOREIGN KEY(translation_id)
            REFERENCES oba_admin.translations(id)
);

-- audio table
CREATE TABLE oba_admin.audio (
    id UUID NOT NULL PRIMARY KEY,
    bucket_path text,
    name TEXT NOT NULL,
    category_id UUID NOT NULL,
    CONSTRAINT fk_category
        FOREIGN KEY(category_id)
            REFERENCES oba_admin.categories(id)
);