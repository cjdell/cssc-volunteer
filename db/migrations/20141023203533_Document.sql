
-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied
CREATE TABLE documents
(
  id bigserial NOT NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  version int NOT NULL DEFAULT 1,
  CONSTRAINT documents_pkey PRIMARY KEY (id),
  CONSTRAINT documents_name UNIQUE (name)
);

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back
DROP TABLE documents;
