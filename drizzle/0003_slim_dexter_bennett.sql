ALTER TABLE "facts"
ADD COLUMN IF NOT EXISTS "target" text;

ALTER TABLE "facts"
ALTER COLUMN "target" SET DEFAULT 'khadidja';

ALTER TABLE "facts"
ALTER COLUMN "target" SET NOT NULL;
