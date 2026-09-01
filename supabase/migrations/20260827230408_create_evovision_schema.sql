/*
# EvoVision Films — Core Content Schema

1. Purpose
- Creates the foundational content management schema for the EvoVision Films
  cinematic media platform.
- Supports movies (KinoMas), episodes (Kadrich Durs), and lessons (Editing Academy).
- Multilingual translations stored per content item for Armenian, Russian, and English.
- Optional sponsor/partner blocks linked to content.
- Admin profiles with role-based access (admin / editor).

2. New Tables
- `admin_profiles` — role info for authenticated administrators (created first
  because other policies reference it)
- `sponsors` — optional partner/partner blocks
- `sponsor_translations` — per-language sponsor text
- `content_items` — all published content (movies, episodes, lessons)
- `content_translations` — per-language text for each content item

3. Security
- RLS enabled on ALL tables.
- Public (anon, authenticated) can SELECT only published content and active sponsors.
- Only authenticated admins (role admin or editor in admin_profiles) can INSERT/UPDATE/DELETE.
- admin_profiles: a user can read their own row; all writes are revoked from clients.
  Role changes go through a SECURITY DEFINER function `set_admin_role` that checks
  the caller is an admin, so users cannot escalate themselves.
*/

-- Admin profiles (must come first — other policies reference it)
CREATE TABLE IF NOT EXISTS admin_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin','editor')),
  display_name text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admin_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "read_own_admin_profile" ON admin_profiles;
CREATE POLICY "read_own_admin_profile" ON admin_profiles FOR SELECT
  TO authenticated USING (id = auth.uid());

REVOKE INSERT ON admin_profiles FROM authenticated;
REVOKE UPDATE ON admin_profiles FROM authenticated;
REVOKE DELETE ON admin_profiles FROM authenticated;

-- Privileged function: only an existing admin can set a user's role.
CREATE OR REPLACE FUNCTION set_admin_role(p_target_user uuid, p_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;

  IF p_role NOT IN ('admin','editor') THEN
    RAISE EXCEPTION 'Invalid role';
  END IF;

  UPDATE admin_profiles SET role = p_role WHERE id = p_target_user;
END;
$$;

REVOKE EXECUTE ON FUNCTION set_admin_role FROM anon;
GRANT EXECUTE ON FUNCTION set_admin_role TO authenticated;

-- Sponsors
CREATE TABLE IF NOT EXISTS sponsors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  logo text,
  banner text,
  link text NOT NULL DEFAULT '',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_active_sponsors" ON sponsors;
CREATE POLICY "public_read_active_sponsors" ON sponsors FOR SELECT
  TO anon, authenticated USING (is_active = true);

DROP POLICY IF EXISTS "admin_insert_sponsors" ON sponsors;
CREATE POLICY "admin_insert_sponsors" ON sponsors FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role IN ('admin','editor'))
  );

DROP POLICY IF EXISTS "admin_update_sponsors" ON sponsors;
CREATE POLICY "admin_update_sponsors" ON sponsors FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role IN ('admin','editor'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role IN ('admin','editor'))
  );

DROP POLICY IF EXISTS "admin_delete_sponsors" ON sponsors;
CREATE POLICY "admin_delete_sponsors" ON sponsors FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role IN ('admin','editor'))
  );

-- Sponsor translations
CREATE TABLE IF NOT EXISTS sponsor_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sponsor_id uuid NOT NULL REFERENCES sponsors(id) ON DELETE CASCADE,
  language text NOT NULL,
  label text NOT NULL DEFAULT '',
  message text NOT NULL DEFAULT '',
  UNIQUE(sponsor_id, language)
);

ALTER TABLE sponsor_translations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_sponsor_translations" ON sponsor_translations;
CREATE POLICY "public_read_sponsor_translations" ON sponsor_translations FOR SELECT
  TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM sponsors WHERE sponsors.id = sponsor_translations.sponsor_id AND sponsors.is_active = true)
  );

DROP POLICY IF EXISTS "admin_insert_sponsor_translations" ON sponsor_translations;
CREATE POLICY "admin_insert_sponsor_translations" ON sponsor_translations FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role IN ('admin','editor'))
  );

DROP POLICY IF EXISTS "admin_update_sponsor_translations" ON sponsor_translations;
CREATE POLICY "admin_update_sponsor_translations" ON sponsor_translations FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role IN ('admin','editor'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role IN ('admin','editor'))
  );

DROP POLICY IF EXISTS "admin_delete_sponsor_translations" ON sponsor_translations;
CREATE POLICY "admin_delete_sponsor_translations" ON sponsor_translations FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role IN ('admin','editor'))
  );

-- Content items
CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('movie','episode','lesson')),
  program_slug text NOT NULL CHECK (program_slug IN ('kinomas','kadrich-durs','academy')),
  category_slug text,
  cover_image text NOT NULL DEFAULT '',
  trailer_url text,
  telegram_link text,
  year int,
  genre text,
  duration text,
  difficulty text CHECK (difficulty IS NULL OR difficulty IN ('beginner','intermediate','advanced')),
  is_premium boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT false,
  featured boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  sponsor_id uuid REFERENCES sponsors(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_published_content" ON content_items;
CREATE POLICY "public_read_published_content" ON content_items FOR SELECT
  TO anon, authenticated USING (is_published = true);

DROP POLICY IF EXISTS "admin_insert_content" ON content_items;
CREATE POLICY "admin_insert_content" ON content_items FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role IN ('admin','editor'))
  );

DROP POLICY IF EXISTS "admin_update_content" ON content_items;
CREATE POLICY "admin_update_content" ON content_items FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role IN ('admin','editor'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role IN ('admin','editor'))
  );

DROP POLICY IF EXISTS "admin_delete_content" ON content_items;
CREATE POLICY "admin_delete_content" ON content_items FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role IN ('admin','editor'))
  );

-- Content translations
CREATE TABLE IF NOT EXISTS content_translations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid NOT NULL REFERENCES content_items(id) ON DELETE CASCADE,
  language text NOT NULL CHECK (language IN ('hy','ru','en')),
  title text NOT NULL,
  synopsis text NOT NULL DEFAULT '',
  description text NOT NULL DEFAULT '',
  seo_title text,
  seo_description text,
  UNIQUE(content_id, language)
);

ALTER TABLE content_translations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_content_translations" ON content_translations;
CREATE POLICY "public_read_content_translations" ON content_translations FOR SELECT
  TO anon, authenticated USING (
    EXISTS (SELECT 1 FROM content_items WHERE content_items.id = content_translations.content_id AND content_items.is_published = true)
  );

DROP POLICY IF EXISTS "admin_insert_content_translations" ON content_translations;
CREATE POLICY "admin_insert_content_translations" ON content_translations FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role IN ('admin','editor'))
  );

DROP POLICY IF EXISTS "admin_update_content_translations" ON content_translations;
CREATE POLICY "admin_update_content_translations" ON content_translations FOR UPDATE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role IN ('admin','editor'))
  ) WITH CHECK (
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role IN ('admin','editor'))
  );

DROP POLICY IF EXISTS "admin_delete_content_translations" ON content_translations;
CREATE POLICY "admin_delete_content_translations" ON content_translations FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM admin_profiles WHERE id = auth.uid() AND role IN ('admin','editor'))
  );

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_content_program ON content_items(program_slug);
CREATE INDEX IF NOT EXISTS idx_content_published ON content_items(is_published, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_featured ON content_items(featured, is_published);
CREATE INDEX IF NOT EXISTS idx_content_category ON content_items(category_slug);
