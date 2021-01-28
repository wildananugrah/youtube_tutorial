CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS tweet_posts(
    id uuid primary key,
    tweet_id varchar(100) not null,
    tweet_user varchar(100) not null,
    content text,
    tweet_link varchar(200),
    author varchar(100),
    author_protected varchar(100),
    author_followers_count varchar(100),
    author_statuses_count varchar(100),
    author_verified varchar(100),
    posted_at timestamp not null,
    created_at timestamp not null,
    updated_at timestamp not null
);