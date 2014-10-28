
-- +goose Up
-- SQL in section 'Up' is executed when this migration is applied
CREATE TYPE user_type AS ENUM ('Admin');

CREATE TABLE users
(
  id bigserial NOT NULL,
  type user_type NOT NULL DEFAULT 'Admin',
  name text,
  email text,
  hash text,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_email UNIQUE (email)
);

INSERT INTO users(type, name, email, hash) VALUES ('Admin', 'Admin', 'admin@example.com', '5f4dcc3b5aa765d61d8327deb882cf99');

CREATE TABLE sessions
(
  id serial NOT NULL,
  user_id bigint,
  api_key character varying(128),
  CONSTRAINT sessions_pk PRIMARY KEY (id),
  CONSTRAINT sessions_api_key UNIQUE (api_key),
  FOREIGN KEY (user_id) REFERENCES users
);

-- +goose Down
-- SQL section 'Down' is executed when this migration is rolled back
DROP TABLE sessions;
DROP TABLE users;

DROP TYPE user_type;
