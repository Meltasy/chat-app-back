-- Enable citext extension
CREATE EXTENSION IF NOT EXISTS citext;

-- Convert username column safely
ALTER TABLE "User"
  ALTER COLUMN "username" TYPE CITEXT
  USING "username"::citext;

-- Convert email column safely
ALTER TABLE "User"
  ALTER COLUMN "email" TYPE CITEXT
  USING "email"::citext;
  