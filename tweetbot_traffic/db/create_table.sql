CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS tweet_mentions(
    id uuid primary key,
    tweet_id varchar(100) not null,
    screen_name varchar(50) not null,
    origin varchar(500), 
    destination varchar(500),
    distance varchar(100), 
    duration varchar(100),
    duration_in_traffic varchar(100),
    status varchar(100),
    created_at timestamp not null,
    updated_at timestamp not null
);