CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS users(
    id uuid primary key,
    screen_name varchar(50) not null,
    origin varchar(500) not null, 
    destination varchar(500) not null,
    distance varchar(100), 
    duration varchar(100),
    duration_in_traffic varchar(100),
    status varchar(100),
    created_at timestamp not null,
    updated_at timestamp not null
);