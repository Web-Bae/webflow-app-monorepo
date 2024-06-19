-- Migration number: 0001 	 2024-06-19T17:35:06.335Z
DROP TABLE IF EXISTS sites;
CREATE TABLE IF NOT EXISTS sites (
    SiteId INTEGER PRIMARY KEY,
    AccessToken TEXT NOT NULL
    NewField TEXT NOT NULL
);
INSERT INTO sites (SiteId, AccessToken) VALUES (1, 'dev1234', 'hello'), (2, 'dev2345', 'world');