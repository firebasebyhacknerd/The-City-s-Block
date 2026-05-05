-- Users table
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  role        TEXT NOT NULL DEFAULT 'buyer',  -- buyer | owner | agent | admin
  phone       TEXT,
  city        TEXT,
  bio         TEXT,
  avatar      TEXT,
  company     TEXT,
  verified    BOOLEAN NOT NULL DEFAULT FALSE,
  banned      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Listings table
CREATE TABLE IF NOT EXISTS listings (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  description      TEXT,
  listing_type     TEXT NOT NULL DEFAULT 'sale',   -- sale | rent
  asset_class      TEXT NOT NULL DEFAULT 'residential', -- residential | commercial
  property_type    TEXT NOT NULL DEFAULT 'Apartment',
  city             TEXT NOT NULL,
  locality         TEXT,
  address          TEXT,
  price            BIGINT NOT NULL DEFAULT 0,
  price_unit       TEXT NOT NULL DEFAULT 'total',  -- total | month
  area             INTEGER,
  bhk              INTEGER,
  bathrooms        INTEGER,
  furnishing       TEXT,
  possession       TEXT,
  amenities        TEXT[],
  images           TEXT[],
  status           TEXT NOT NULL DEFAULT 'pending', -- pending | active | rejected | draft
  rejection_reason TEXT,
  featured         BOOLEAN NOT NULL DEFAULT FALSE,
  verified         BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Inquiries table
CREATE TABLE IF NOT EXISTS inquiries (
  id            SERIAL PRIMARY KEY,
  listing_id    INTEGER NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  buyer_name    TEXT NOT NULL,
  buyer_email   TEXT NOT NULL,
  buyer_phone   TEXT NOT NULL,
  message       TEXT,
  status        TEXT NOT NULL DEFAULT 'new',  -- new | contacted | closed
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed admin user (password: Admin@123)
INSERT INTO users (name, email, password, role, city, verified)
VALUES (
  'Admin',
  'admin@citysblock.in',
  '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  'admin',
  'New Delhi',
  TRUE
) ON CONFLICT (email) DO NOTHING;
