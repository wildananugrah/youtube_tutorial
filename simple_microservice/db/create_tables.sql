CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS app_user (
  email varchar(45) NOT NULL,
  password varchar(450) NOT NULL,
  id uuid NOT NULL,
  PRIMARY KEY (id)
);
