CREATE TABLE finders
(
    id           SERIAL PRIMARY KEY,
    user_name    VARCHAR(255) NOT NULL,
    user_surname VARCHAR(255) NOT NULL,
    email        VARCHAR(255) NOT NULL UNIQUE,
    password     VARCHAR(255) NOT NULL,
    created_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at   TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recruiters
(
    id              SERIAL PRIMARY KEY,
    user_name       VARCHAR(255) NOT NULL,
    user_surname    VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL UNIQUE,
    password        VARCHAR(255) NOT NULL,
    name_company    VARCHAR(255),
    address_company VARCHAR(255),
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts
(
    id              SERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    about_company   TEXT        NOT NULL,
    description     TEXT         NOT NULL,
    work_format     VARCHAR(255) NOT NULL,
    experience      VARCHAR(255) NOT NULL,
    language        VARCHAR(255) NOT NULL,
    tags            VARCHAR(255),
    recruiter_id    INT REFERENCES recruiters (id) ON DELETE CASCADE,
    created_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE saved_posts
(
    id        SERIAL PRIMARY KEY,
    finder_id INT REFERENCES finders (id) ON DELETE CASCADE,
    post_id   INT REFERENCES posts (id) ON DELETE CASCADE
);

CREATE TABLE reviews(
	id BIGSERIAL PRIMARY KEY,
  about_finder TEXT NOT NULL,
  finder_id INTEGER REFERENCES public.finders(id),
  post_id INTEGER REFERENCES public.posts(id)
);

CREATE
OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at
= NOW();
RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER update_finders_timestamp
    BEFORE UPDATE
    ON finders
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_recruiters_timestamp
    BEFORE UPDATE
    ON recruiters
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_posts_timestamp
    BEFORE UPDATE
    ON posts
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();