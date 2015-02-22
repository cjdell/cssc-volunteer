
-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied
ALTER TABLE users DROP COLUMN type;

DROP TYPE user_type;
CREATE TYPE user_type AS ENUM ('Admin', 'Client');

ALTER TABLE users ADD COLUMN type user_type NOT NULL DEFAULT 'Admin'::user_type;

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back
ALTER TABLE users DROP COLUMN type;

DROP TYPE user_type;
CREATE TYPE user_type AS ENUM ('Admin');

ALTER TABLE users ADD COLUMN type user_type NOT NULL DEFAULT 'Admin'::user_type;
