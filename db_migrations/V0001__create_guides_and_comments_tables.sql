CREATE TABLE IF NOT EXISTS guides (
    id SERIAL PRIMARY KEY,
    hero_id INTEGER NOT NULL,
    hero_name VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    skills TEXT,
    items TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS comments (
    id SERIAL PRIMARY KEY,
    guide_id INTEGER NOT NULL,
    author VARCHAR(100) NOT NULL,
    text TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_guides_hero_id ON guides(hero_id);
CREATE INDEX IF NOT EXISTS idx_comments_guide_id ON comments(guide_id);