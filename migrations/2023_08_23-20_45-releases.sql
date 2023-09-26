-- Add latest release to DB
ALTER TABLE oba_admin.translations
ADD column latest_version INTEGER NOT NULL;