-- Bootstrap SQL for KooKoo survey (Postgres / Supabase compatible)
-- Includes schema, reference data, RLS policies, and seed data

/* =========================
   Extensions
   ========================= */
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

/* =========================
   ENUMS
   ========================= */
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_type_enum') THEN
    CREATE TYPE user_type_enum AS ENUM ('passenger', 'cargo', 'partner');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_input_type_enum') THEN
    CREATE TYPE question_input_type_enum AS ENUM (
      'single_choice','multi_choice','text','email','tel','boolean','number','date','datetime','json'
    );
  END IF;
END$$;

/* =========================
   SCHEMA: surveys/pages/respondents
   ========================= */
CREATE TABLE IF NOT EXISTS surveys (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid REFERENCES surveys(id) ON DELETE CASCADE,
  code text NOT NULL,
  title text,
  description text,
  position int NOT NULL DEFAULT 0,
  metadata jsonb,
  UNIQUE (survey_id, code),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS respondents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  whatsapp text,
  user_type user_type_enum,
  origin text,
  destination text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_respondents_email ON respondents (lower(email));
CREATE INDEX IF NOT EXISTS idx_respondents_user_type ON respondents (user_type);

/* =========================
   Reference tables: countries, events, cargo_categories
   ========================= */
CREATE TABLE IF NOT EXISTS countries (
  code text PRIMARY KEY,
  name text NOT NULL,
  flag text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id text PRIMARY KEY,
  name text NOT NULL,
  date_text text,
  location text,
  description text,
  expected_attendees text,
  category text,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cargo_categories (
  id text PRIMARY KEY,
  label text NOT NULL,
  description text,
  icon text,
  examples text[],
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

/* =========================
   Questions / Options
   ========================= */
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  survey_id uuid REFERENCES surveys(id) ON DELETE SET NULL,
  page_id uuid REFERENCES pages(id) ON DELETE SET NULL,
  code text NOT NULL,
  label text NOT NULL,
  input_type question_input_type_enum NOT NULL,
  required boolean NOT NULL DEFAULT false,
  validation jsonb,
  metadata jsonb,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (survey_id, code)
);

CREATE INDEX IF NOT EXISTS idx_questions_code ON questions (code);

CREATE TABLE IF NOT EXISTS question_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  code text,
  label text NOT NULL,
  value text,
  reference_table text,
  reference_id text,
  position int NOT NULL DEFAULT 0,
  metadata jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_question_options_question ON question_options (question_id);

/* =========================
   Responses / Response choices
   ========================= */
CREATE TABLE IF NOT EXISTS responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  respondent_id uuid REFERENCES respondents(id) ON DELETE CASCADE,
  question_id uuid REFERENCES questions(id) ON DELETE CASCADE,
  answer_text text,
  answer_number numeric,
  answer_bool boolean,
  answer_date date,
  answer_datetime timestamptz,
  answer_json jsonb,
  option_id uuid REFERENCES question_options(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (respondent_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_responses_respondent ON responses (respondent_id);
CREATE INDEX IF NOT EXISTS idx_responses_question ON responses (question_id);
CREATE INDEX IF NOT EXISTS idx_responses_created_at ON responses (created_at);

CREATE TABLE IF NOT EXISTS response_choices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  response_id uuid REFERENCES responses(id) ON DELETE CASCADE,
  option_id uuid REFERENCES question_options(id),
  reference_table text,
  reference_id text,
  value text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_response_choices_option ON response_choices (option_id);
CREATE INDEX IF NOT EXISTS idx_response_choices_reference ON response_choices (reference_table, reference_id);

/* =========================
   Triggers to maintain updated_at
   ========================= */
CREATE OR REPLACE FUNCTION trg_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_questions_updated_at') THEN
    CREATE TRIGGER trg_questions_updated_at
    BEFORE UPDATE ON questions
    FOR EACH ROW EXECUTE PROCEDURE trg_set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_pages_updated_at') THEN
    CREATE TRIGGER trg_pages_updated_at
    BEFORE UPDATE ON pages
    FOR EACH ROW EXECUTE PROCEDURE trg_set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_surveys_updated_at') THEN
    CREATE TRIGGER trg_surveys_updated_at
    BEFORE UPDATE ON surveys
    FOR EACH ROW EXECUTE PROCEDURE trg_set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_respondents_updated_at') THEN
    CREATE TRIGGER trg_respondents_updated_at
    BEFORE UPDATE ON respondents
    FOR EACH ROW EXECUTE PROCEDURE trg_set_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_responses_updated_at') THEN
    CREATE TRIGGER trg_responses_updated_at
    BEFORE UPDATE ON responses
    FOR EACH ROW EXECUTE PROCEDURE trg_set_updated_at();
  END IF;
END$$;

/* =========================
   Convenience view for reporting (anonymized)
   Only include non-PII fields here
   ========================= */
CREATE OR REPLACE VIEW public.anonymized_responses AS
SELECT
  r.id as response_id,
  r.question_id,
  q.code as question_code,
  r.answer_text,
  r.answer_number,
  r.answer_bool,
  r.answer_date,
  r.answer_datetime,
  r.answer_json,
  r.option_id,
  r.created_at
FROM responses r
JOIN questions q ON q.id = r.question_id;

/* =========================
   Insert reference data: events, cargo_categories, countries
   (populated from src/data/events.ts and src/data/countries.ts)
   ========================= */
-- Countries (caribbeanCountries)
INSERT INTO countries (code, name, flag)
VALUES
  ('antigua-barbuda','Antigua and Barbuda','🇦🇬'),
  ('anguilla','Anguilla','🇦🇮'),
  ('aruba','Aruba','🇦🇼'),
  ('bahamas','Bahamas','🇧🇸'),
  ('barbados','Barbados','🇧🇧'),
  ('belize','Belize','🇧🇿'),
  ('bermuda','Bermuda','🇧🇲'),
  ('british-virgin-islands','British Virgin Islands','🇻🇬'),
  ('cayman-islands','Cayman Islands','🇰🇾'),
  ('curacao','Curaçao','🇨🇼'),
  ('dominica','Dominica','🇩🇲'),
  ('dominican-republic','Dominican Republic','🇩🇴'),
  ('grenada','Grenada','🇬🇩'),
  ('guadeloupe','Guadeloupe','🇬🇵'),
  ('guyana','Guyana','🇬🇾'),
  ('haiti','Haiti','🇭🇹'),
  ('jamaica','Jamaica','🇯🇲'),
  ('martinique','Martinique','🇲🇶'),
  ('montserrat','Montserrat','🇲🇸'),
  ('puerto-rico','Puerto Rico','🇵🇷'),
  ('saint-kitts-nevis','Saint Kitts and Nevis','🇰🇳'),
  ('saint-lucia','Saint Lucia','🇱🇨'),
  ('saint-vincent-grenadines','Saint Vincent and the Grenadines','🇻🇨'),
  ('suriname','Suriname','🇸🇷'),
  ('sint-maarten','Sint Maarten','🇸🇽'),
  ('trinidad-tobago','Trinidad and Tobago','🇹🇹'),
  ('turks-caicos','Turks and Caicos Islands','🇹🇨'),
  ('us-virgin-islands','US Virgin Islands','🇻🇮')
ON CONFLICT (code) DO NOTHING;

-- Cargo categories
INSERT INTO cargo_categories (id, label, description, icon, examples)
VALUES
  ('agricultural','Agricultural Products','Fresh produce, processed foods, spices','🌾', ARRAY['Mangoes','Bananas','Spices','Rum','Hot sauce']),
  ('manufacturing','Manufacturing & Industrial','Machinery, equipment, raw materials','🏭', ARRAY['Construction materials','Solar panels','Machinery parts','Textiles']),
  ('medical','Medical & Pharmaceutical','Medical supplies, pharmaceuticals, equipment','⚕️', ARRAY['Medications','Medical devices','Vaccines','Diagnostic equipment']),
  ('consumer','Consumer Goods','Retail products, electronics, household items','📦', ARRAY['Electronics','Clothing','Household items','Auto parts']),
  ('perishable','Perishable Goods','Time-sensitive fresh products','🧊', ARRAY['Fresh fish','Dairy products','Fresh produce','Flowers']),
  ('bulk','Bulk Commodities','Large volume raw materials','⚡', ARRAY['Fuel','Building materials','Fertilizer','Animal feed'])
ON CONFLICT (id) DO NOTHING;

-- Events (sample from events.ts)
INSERT INTO events (id, name, date_text, location, description, expected_attendees, category)
VALUES
  ('cpl-2025','Caribbean Premier League 2025','July 2025','Multiple islands','Premier T20 cricket tournament across 6 Caribbean nations','500,000+','sports'),
  ('carifta-games-2025','CARIFTA Games 2025','April 2025','Barbados','Annual athletics competition for Caribbean youth','15,000+','sports'),
  ('windward-sailing','Windward Islands Regatta','February 2025','Grenada → St. Vincent → St. Lucia','Annual sailing championship between Windward Islands','5,000+','sports'),
  ('caribbean-football','Caribbean Cup Qualifiers','March-June 2025','Various islands','Football championship qualifiers across the region','100,000+','sports'),
  ('basketball-championship','Caribbean Basketball Championship','August 2025','Puerto Rico','Regional basketball tournament','25,000+','sports'),
  ('trinidad-carnival','Trinidad Carnival 2025','March 3-4, 2025','Trinidad & Tobago','The mother of all Caribbean carnivals','1,000,000+','carnival'),
  ('barbados-crop-over','Crop Over Festival','June-August 2025','Barbados','Traditional harvest festival culminating in Grand Kadooment','300,000+','carnival'),
  ('jamaica-carnival','Jamaica Carnival','April 2025','Jamaica','Vibrant celebration of Jamaican culture and music','200,000+','carnival'),
  ('antigua-carnival','Antigua Carnival','July-August 2025','Antigua & Barbuda','Summer carnival celebration with J''ouvert and parades','150,000+','carnival'),
  ('dominica-carnival','Dominica Carnival','February 2025','Dominica','Traditional Mas celebration in the Nature Island','50,000+','carnival'),
  ('st-lucia-carnival','Saint Lucia Carnival','July 2025','Saint Lucia','Colorful celebration blending African and European traditions','100,000+','carnival'),
  ('caricom-summit','CARICOM Heads of Government Meeting','July 2025','Rotating host','Annual summit of Caribbean leaders','5,000+','business'),
  ('caribbean-investment-summit','Caribbean Investment Summit','May 2025','Barbados','Regional business and investment conference','3,000+','business'),
  ('oecs-conference','OECS Economic Forum','September 2025','Saint Lucia','Eastern Caribbean economic development conference','2,000+','business'),
  ('tourism-board-meeting','Caribbean Tourism Conference','October 2025','Jamaica','Annual tourism industry conference','4,000+','business'),
  ('uwi-graduation','UWI Graduation Ceremonies','Oct-Nov 2025','Multiple campuses','University of the West Indies graduation across campuses','50,000+','education'),
  ('caribbean-educators-conference','Caribbean Educators Conference','June 2025','Trinidad & Tobago','Regional education development conference','2,500+','education'),
  ('medical-students-conference','Caribbean Medical Students Conference','April 2025','Barbados','Annual conference for Caribbean medical students','1,500+','education'),
  ('carifesta','CARIFESTA 2025','August 2025','Antigua & Barbuda','Caribbean Festival of Arts - cultural and educational exchange','100,000+','cultural'),
  ('christmas-season','Christmas & New Year Season','Dec 2024 - Jan 2025','All islands','Peak family travel season across the Caribbean','2,000,000+','family'),
  ('easter-holidays','Easter Holiday Period','March-April 2025','All islands','Traditional family reunion time','800,000+','family'),
  ('summer-holidays','Summer School Holidays','July-August 2025','All islands','Peak period for family visits and vacations','1,500,000+','family'),
  ('independence-celebrations','Independence Day Celebrations','Various dates 2025','Multiple islands','National independence celebrations drawing diaspora home','500,000+','family'),
  ('reggae-sumfest','Reggae Sumfest','July 2025','Jamaica','Premier reggae music festival','300,000+','cultural'),
  ('calypso-monarch','Calypso Monarch Competition','February 2025','Trinidad & Tobago','Premier calypso competition','50,000+','cultural'),
  ('steel-pan-festival','World Steel Pan Festival','August 2025','Trinidad & Tobago','International steel pan competition','25,000+','cultural')
ON CONFLICT (id) DO NOTHING;

/* =========================
   Questions and options seed (minimal set covering campaign, passenger and cargo flows, final CTA)
   ========================= */
-- Create a survey record
INSERT INTO surveys (code, title, description) VALUES ('kookoo_prelaunch','KooKoo Prelaunch Survey','User demand and cargo pooling survey')
ON CONFLICT (code) DO NOTHING;

-- Grab survey id
WITH s AS (SELECT id FROM surveys WHERE code = 'kookoo_prelaunch')
INSERT INTO pages (survey_id, code, title, position)
SELECT (SELECT id FROM s), 'campaign', 'Campaign', 0
ON CONFLICT (survey_id, code) DO NOTHING;

WITH s AS (SELECT id FROM surveys WHERE code = 'kookoo_prelaunch'),
     p AS (SELECT id FROM pages WHERE survey_id = (SELECT id FROM s) AND code = 'campaign')
INSERT INTO questions (survey_id, page_id, code, label, input_type, required, position)
SELECT (SELECT id FROM s), (SELECT id FROM p), 'campaign.type', 'Role (passenger, cargo, partner)', 'single_choice'::question_input_type_enum, true, 10
ON CONFLICT (survey_id, code) DO NOTHING;

-- campaign origin/destination/email
WITH s AS (SELECT id FROM surveys WHERE code = 'kookoo_prelaunch'), p AS (SELECT id FROM pages WHERE survey_id = (SELECT id FROM s) AND code = 'campaign')
INSERT INTO questions (survey_id, page_id, code, label, input_type, required, position)
SELECT (SELECT id FROM s), (SELECT id FROM p), 'campaign.origin', 'From (origin island)', 'single_choice'::question_input_type_enum, true, 20
ON CONFLICT (survey_id, code) DO NOTHING;

WITH s AS (SELECT id FROM surveys WHERE code = 'kookoo_prelaunch'), p AS (SELECT id FROM pages WHERE survey_id = (SELECT id FROM s) AND code = 'campaign')
INSERT INTO questions (survey_id, page_id, code, label, input_type, required, position)
SELECT (SELECT id FROM s), (SELECT id FROM p), 'campaign.destination', 'To (destination island)', 'single_choice'::question_input_type_enum, true, 30
ON CONFLICT (survey_id, code) DO NOTHING;

WITH s AS (SELECT id FROM surveys WHERE code = 'kookoo_prelaunch'), p AS (SELECT id FROM pages WHERE survey_id = (SELECT id FROM s) AND code = 'campaign')
INSERT INTO questions (survey_id, page_id, code, label, input_type, required, position)
SELECT (SELECT id FROM s), (SELECT id FROM p), 'campaign.email', 'Email for updates', 'email'::question_input_type_enum, true, 40
ON CONFLICT (survey_id, code) DO NOTHING;

-- Passenger page and questions
INSERT INTO pages (survey_id, code, title, position)
SELECT id, 'passenger', 'Passenger Flow', 10 FROM surveys WHERE code = 'kookoo_prelaunch'
ON CONFLICT (survey_id, code) DO NOTHING;

WITH s AS (SELECT id FROM surveys WHERE code='kookoo_prelaunch'), p AS (SELECT id FROM pages WHERE survey_id = (SELECT id FROM s) AND code = 'passenger')
INSERT INTO questions (survey_id, page_id, code, label, input_type, required, position)
VALUES
  ((SELECT id FROM s), (SELECT id FROM p), 'passenger.origin','From (origin island)','single_choice'::question_input_type_enum, false, 10),
  ((SELECT id FROM s), (SELECT id FROM p), 'passenger.destination','To (destination island)','single_choice'::question_input_type_enum, false, 20),
  ((SELECT id FROM s), (SELECT id FROM p), 'passenger.dates','When do you want to travel?','single_choice'::question_input_type_enum, true, 30),
  ((SELECT id FROM s), (SELECT id FROM p), 'passenger.reasons','Why do you travel?','multi_choice'::question_input_type_enum, false, 40),
  ((SELECT id FROM s), (SELECT id FROM p), 'passenger.specific_events','Any specific events?','multi_choice'::question_input_type_enum, false, 50),
  ((SELECT id FROM s), (SELECT id FROM p), 'passenger.travelers','How many travelers?','single_choice'::question_input_type_enum, false, 60)
ON CONFLICT (survey_id, code) DO NOTHING;

-- Cargo page and questions
INSERT INTO pages (survey_id, code, title, position)
SELECT id, 'cargo', 'Cargo Flow', 20 FROM surveys WHERE code = 'kookoo_prelaunch'
ON CONFLICT (survey_id, code) DO NOTHING;

WITH s AS (SELECT id FROM surveys WHERE code='kookoo_prelaunch'), p AS (SELECT id FROM pages WHERE survey_id = (SELECT id FROM s) AND code = 'cargo')
INSERT INTO questions (survey_id, page_id, code, label, input_type, required, position)
VALUES
  ((SELECT id FROM s), (SELECT id FROM p), 'cargo.origin','From (origin island)','single_choice'::question_input_type_enum, false, 10),
  ((SELECT id FROM s), (SELECT id FROM p), 'cargo.destination','To (destination island)','single_choice'::question_input_type_enum, false, 20),
  ((SELECT id FROM s), (SELECT id FROM p), 'cargo.types','What are you shipping?','multi_choice'::question_input_type_enum, true, 30),
  ((SELECT id FROM s), (SELECT id FROM p), 'cargo.weight','Approximate weight/volume','single_choice'::question_input_type_enum, true, 40),
  ((SELECT id FROM s), (SELECT id FROM p), 'cargo.urgency','Shipping urgency','single_choice'::question_input_type_enum, true, 50),
  ((SELECT id FROM s), (SELECT id FROM p), 'cargo.special_needs','Special requirements?','multi_choice'::question_input_type_enum, false, 60)
ON CONFLICT (survey_id, code) DO NOTHING;

-- Final CTA page
INSERT INTO pages (survey_id, code, title, position)
SELECT id, 'final_cta', 'Final CTA', 30 FROM surveys WHERE code = 'kookoo_prelaunch'
ON CONFLICT (survey_id, code) DO NOTHING;

WITH s AS (SELECT id FROM surveys WHERE code='kookoo_prelaunch'), p AS (SELECT id FROM pages WHERE survey_id = (SELECT id FROM s) AND code = 'final_cta')
INSERT INTO questions (survey_id, page_id, code, label, input_type, required, position)
VALUES
  ((SELECT id FROM s), (SELECT id FROM p), 'cta.email','Email Address','email'::question_input_type_enum, true, 10),
  ((SELECT id FROM s), (SELECT id FROM p), 'cta.whatsapp','WhatsApp Number','tel'::question_input_type_enum, false, 20),
  ((SELECT id FROM s), (SELECT id FROM p), 'cta.pref_email','Email updates','boolean'::question_input_type_enum, false, 30),
  ((SELECT id FROM s), (SELECT id FROM p), 'cta.pref_whatsapp','WhatsApp updates','boolean'::question_input_type_enum, false, 40),
  ((SELECT id FROM s), (SELECT id FROM p), 'cta.pref_community','Community updates','boolean'::question_input_type_enum, false, 50)
ON CONFLICT (survey_id, code) DO NOTHING;

/* =========================
   Populate question options (examples)
   We'll insert options for fixed choice lists: travel reasons, group sizes, travelTimeframes, urgencyLevels, weightOptions, specialRequirements, cargoCategories
   ========================= */
-- passenger reasons
WITH q AS (SELECT id FROM questions WHERE code = 'passenger.reasons')
INSERT INTO question_options (question_id, code, label, value, position)
SELECT (SELECT id FROM q), 'family', 'Visit Family', 'family', 10
UNION ALL SELECT (SELECT id FROM q), 'work', 'Business', 'work', 20
UNION ALL SELECT (SELECT id FROM q), 'carnival', 'Carnival/Events', 'carnival', 30
UNION ALL SELECT (SELECT id FROM q), 'study', 'Education', 'study', 40
UNION ALL SELECT (SELECT id FROM q), 'sports', 'Sporting Event', 'sports', 50
ON CONFLICT DO NOTHING;

-- passenger travelers (group sizes)
WITH q AS (SELECT id FROM questions WHERE code = 'passenger.travelers')
INSERT INTO question_options (question_id, code, label, value, metadata, position)
SELECT (SELECT id FROM q), 'solo','Just me','solo', jsonb_build_object('multiplier',1), 10
UNION ALL SELECT (SELECT id FROM q), 'couple','2 people','couple', jsonb_build_object('multiplier',2), 20
UNION ALL SELECT (SELECT id FROM q), 'small-group','3-5 people','small-group', jsonb_build_object('multiplier',4), 30
UNION ALL SELECT (SELECT id FROM q), 'family','6-10 people','family', jsonb_build_object('multiplier',8), 40
UNION ALL SELECT (SELECT id FROM q), 'large-group','10+ people','large-group', jsonb_build_object('multiplier',15), 50
ON CONFLICT DO NOTHING;

-- travel timeframes: insert a compact set matching travelTimeframes
WITH q AS (SELECT id FROM questions WHERE code = 'passenger.dates')
INSERT INTO question_options (question_id, code, label, value, metadata, position)
SELECT (SELECT id FROM q), 'january-2025','January 2025','january-2025', jsonb_build_object('season','peak'), 10
UNION ALL SELECT (SELECT id FROM q), 'february-2025','February 2025','february-2025', jsonb_build_object('season','peak'), 20
UNION ALL SELECT (SELECT id FROM q), 'march-2025','March 2025','march-2025', jsonb_build_object('season','high'), 30
UNION ALL SELECT (SELECT id FROM q), 'carnival-season','Carnival Season (Feb-Mar)','carnival-season', jsonb_build_object('season','peak'), 40
UNION ALL SELECT (SELECT id FROM q), 'summer-holidays','Summer Holidays (Jul-Aug)','summer-holidays', jsonb_build_object('season','high'), 50
UNION ALL SELECT (SELECT id FROM q), 'flexible','Flexible / Any time','flexible', jsonb_build_object('season','regular'), 60
ON CONFLICT DO NOTHING;

-- cargo types (reference to cargo_categories)
WITH q AS (SELECT id FROM questions WHERE code = 'cargo.types')
INSERT INTO question_options (question_id, code, label, value, reference_table, reference_id, position)
SELECT (SELECT id FROM q), cc.id, cc.label, cc.id, 'cargo_categories', cc.id, row_number() OVER ()
FROM cargo_categories cc
ON CONFLICT DO NOTHING;

-- cargo weight options
WITH q AS (SELECT id FROM questions WHERE code = 'cargo.weight')
INSERT INTO question_options (question_id, code, label, value, position)
SELECT (SELECT id FROM q), 'under-50lbs','Under 50 lbs','under-50lbs',10
UNION ALL SELECT (SELECT id FROM q), '50-200lbs','50-200 lbs','50-200lbs',20
UNION ALL SELECT (SELECT id FROM q), '200-500lbs','200-500 lbs','200-500lbs',30
UNION ALL SELECT (SELECT id FROM q), '500-1000lbs','500-1000 lbs','500-1000lbs',40
UNION ALL SELECT (SELECT id FROM q), '1000-2000lbs','1000-2000 lbs','1000-2000lbs',50
UNION ALL SELECT (SELECT id FROM q), 'over-2000lbs','Over 2000 lbs','over-2000lbs',60
UNION ALL SELECT (SELECT id FROM q), 'pallet','1 Standard Pallet','pallet',70
UNION ALL SELECT (SELECT id FROM q), 'multiple-pallets','Multiple Pallets','multiple-pallets',80
UNION ALL SELECT (SELECT id FROM q), 'container','Full Container','container',90
ON CONFLICT DO NOTHING;

-- cargo urgency options
WITH q AS (SELECT id FROM questions WHERE code = 'cargo.urgency')
INSERT INTO question_options (question_id, code, label, value, metadata, position)
SELECT (SELECT id FROM q), 'urgent','Urgent (1-3 days)','urgent', jsonb_build_object('description','Express shipping needed'), 10
UNION ALL SELECT (SELECT id FROM q), 'priority','Priority (1 week)','priority', jsonb_build_object('description','Fast but cost-effective'), 20
UNION ALL SELECT (SELECT id FROM q), 'standard','Standard (2-4 weeks)','standard', jsonb_build_object('description','Regular shipping schedule'), 30
UNION ALL SELECT (SELECT id FROM q), 'economical','Economical (1-2 months)','economical', jsonb_build_object('description','Cost-optimized, flexible timing'), 40
UNION ALL SELECT (SELECT id FROM q), 'bulk','Bulk/Seasonal','bulk', jsonb_build_object('description','Large volumes, best rates'), 50
ON CONFLICT DO NOTHING;

-- cargo special needs (map to specialRequirements)
WITH q AS (SELECT id FROM questions WHERE code = 'cargo.special_needs')
INSERT INTO question_options (question_id, code, label, value, position)
SELECT (SELECT id FROM q), 'refrigerated','Refrigerated','refrigerated',10
UNION ALL SELECT (SELECT id FROM q), 'fragile','Fragile','fragile',20
UNION ALL SELECT (SELECT id FROM q), 'hazardous','Hazardous','hazardous',30
UNION ALL SELECT (SELECT id FROM q), 'oversized','Oversized','oversized',40
UNION ALL SELECT (SELECT id FROM q), 'high-value','High Value','high-value',50
UNION ALL SELECT (SELECT id FROM q), 'perishable','Perishable','perishable',60
ON CONFLICT DO NOTHING;

/* =========================
   RLS (Row Level Security) Policies for Supabase
   - Protect PII in respondents
   - Ensure users can insert their own responses
   - service_role bypasses RLS (Supabase default)
   ========================= */

-- Enable RLS on respondents
ALTER TABLE respondents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS respondents_insert_anon ON respondents;
CREATE POLICY respondents_insert_anon ON respondents
  FOR INSERT TO anon
  WITH CHECK (true);

-- Policy: anon cannot select/update/delete respondents (default deny)

-- For responses: allow anon to insert their own responses (assuming we record respondent_id returned after creating respondent)
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS responses_insert_anon ON responses;
CREATE POLICY responses_insert_anon ON responses
  FOR INSERT TO anon
  WITH CHECK (true);

-- Deny anon SELECT on responses (they should use an API to read aggregated/anonymized views)

-- Reporting role: allow read-only access to anonymized view
-- Note: create a Postgres role 'reporting' and grant SELECT on view
GRANT SELECT ON public.anonymized_responses TO public;

/* Example RLS to prevent respondents from seeing each other's PII:
   - For a more complete production setup, create a server endpoint that creates respondents and returns a JWT or temporary token associated with respondent_id
   - The policies below assume a `jwt.claims.sub` maps to respondent_id (adjust as needed)
*/

-- Respondents: allow owner to select/update their row when jwt.sub == respondent_id
DROP POLICY IF EXISTS respondents_owner_select ON respondents;
CREATE POLICY respondents_owner_select ON respondents
  FOR SELECT USING (current_setting('request.jwt.claims.sub', true) = id::text OR auth.role() = 'service_role');

DROP POLICY IF EXISTS respondents_owner_update ON respondents;
CREATE POLICY respondents_owner_update ON respondents
  FOR UPDATE USING (current_setting('request.jwt.claims.sub', true) = id::text OR auth.role() = 'service_role')
  WITH CHECK (current_setting('request.jwt.claims.sub', true) = id::text OR auth.role() = 'service_role');

-- Responses: owner can see their own responses if jwt.sub == respondent_id
DROP POLICY IF EXISTS responses_owner_select ON responses;
CREATE POLICY responses_owner_select ON responses
  FOR SELECT USING (current_setting('request.jwt.claims.sub', true) = respondent_id::text OR auth.role() = 'service_role');

-- Insert allowed for anon but must be accompanied by server logic to set respondent_id appropriately
DROP POLICY IF EXISTS responses_owner_insert ON responses;
CREATE POLICY responses_owner_insert ON responses
  FOR INSERT WITH CHECK (true);

/* =========================
   Final notes: grant minimal privileges to anon and rely on server to use service_role key
   For testing, you can disable RLS temporarily or set auth.role() via Supabase
   ========================= */

-- End of bootstrap.sql
