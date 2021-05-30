
CREATE TABLE movies (
    "movie" varchar NOT NULL,
    "year" smallint,
    "genre" varchar,
    "duration" smallint,
    "rating" decimal(2,1),
    "director" varchar NOT NULL,
    "director_dob" date,
    "director_country" varchar,
    "actors" varchar,
    "theater_name" varchar,
    "theater_address" varchar,
    "theater_state" varchar,
    "theater_zip" smallint,
    "date" date,
    "time" time
);