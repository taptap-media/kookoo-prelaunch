-- Seed questions and question_options for KooKoo prelaunch survey
-- Run after db/bootstrap.sql or when schema exists

-- Ensure survey exists
INSERT INTO surveys (code, title) VALUES ('kookoo_prelaunch','KooKoo Prelaunch Survey') ON CONFLICT (code) DO NOTHING;

-- Campaign page and questions
WITH s AS (SELECT id FROM surveys WHERE code = 'kookoo_prelaunch')
INSERT INTO pages (survey_id, code, title, position)
SELECT s.id, 'campaign', 'Campaign', 0 FROM s
ON CONFLICT (survey_id, code) DO NOTHING;

-- Questions (IDempotent)
WITH s AS (SELECT id FROM surveys WHERE code='kookoo_prelaunch'), p AS (SELECT id FROM pages WHERE survey_id = s.id AND code = 'campaign')
INSERT INTO questions (survey_id, page_id, code, label, input_type, required, position)
SELECT s.id, p.id, 'campaign.type', 'Role (passenger, cargo, partner)', 'single_choice'::question_input_type_enum, true, 10 FROM s, p
ON CONFLICT (survey_id, code) DO NOTHING;

-- Additional questions and options can be added similarly
