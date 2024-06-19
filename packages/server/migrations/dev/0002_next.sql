-- Migration number: 0002 	 2024-06-19T17:38:27.053Z
DROP TABLE IF EXISTS sites;
CREATE TABLE IF NOT EXISTS sites (
    SiteId INTEGER PRIMARY KEY,
    AccessToken TEXT NOT NULL,
    NewField TEXT NOT NULL
);
INSERT INTO sites (SiteId, AccessToken, NewField) VALUES (1, 'dev1234', 'hello'), (2, 'dev2345', 'world');