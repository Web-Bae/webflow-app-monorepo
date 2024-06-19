-- Migration number: 0001 	 2024-06-19T17:34:49.765Z
DROP TABLE IF EXISTS sites;
CREATE TABLE IF NOT EXISTS sites (
    SiteId INTEGER PRIMARY KEY,
    AccessToken TEXT NOT NULL
);
INSERT INTO sites (SiteId, AccessToken) VALUES (1, 'prod123'), (2, 'prod234');