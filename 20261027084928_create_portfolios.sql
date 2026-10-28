/*
# Create MYFORTFOLIO.COM portfolio storage

1. New Tables
- `portfolios` stores one editable portfolio per signed-in user.
- `id` is the portfolio identifier.
- `user_id` links the portfolio to the Supabase auth account and defaults to the current user.
- `username` is the public URL handle and must be unique.
- `content` stores profile, skills, achievements, certifications, projects, leadership, education, contact, and image data as JSON.
- `template` stores the selected visual template.
- `published` controls whether the public profile is visible.
- `updated_at` and `created_at` track changes.

2. Security
- RLS is enabled.
- Signed-in users can create, read, update, and delete only their own portfolio.
- Anyone can read only portfolios explicitly marked published, so public /u/username pages work without sign-in.
- Grants are limited to the roles and actions used by the app.

3. Important Notes
- Supabase email/password authentication remains the source of truth for accounts and password hashing.
- Portfolio JSON keeps uploaded image data with the portfolio so the upload flow works without exposing files publicly.
*/

CREATE TABLE IF NOT EXISTS public.portfolios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL UNIQUE CHECK (username ~ '^[a-z0-9][a-z0-9-]{2,29}$'),
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  template text NOT NULL DEFAULT 'classic-dark',
  published boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT, UPDATE, DELETE ON public.portfolios TO authenticated;
GRANT SELECT ON public.portfolios TO anon;

DROP POLICY IF EXISTS "owners_select_portfolios" ON public.portfolios;
CREATE POLICY "owners_select_portfolios" ON public.portfolios FOR SELECT TO authenticated
USING (auth.uid() = user_id OR published = true);

DROP POLICY IF EXISTS "public_read_published_portfolios" ON public.portfolios;
CREATE POLICY "public_read_published_portfolios" ON public.portfolios FOR SELECT TO anon
USING (published = true);

DROP POLICY IF EXISTS "owners_insert_portfolios" ON public.portfolios;
CREATE POLICY "owners_insert_portfolios" ON public.portfolios FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owners_update_portfolios" ON public.portfolios;
CREATE POLICY "owners_update_portfolios" ON public.portfolios FOR UPDATE TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "owners_delete_portfolios" ON public.portfolios;
CREATE POLICY "owners_delete_portfolios" ON public.portfolios FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS portfolios_published_username_idx ON public.portfolios (username) WHERE published = true;
