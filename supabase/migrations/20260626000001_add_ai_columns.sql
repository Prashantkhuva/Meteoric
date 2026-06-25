ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_score int;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_category text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_summary text;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ai_insights jsonb;
