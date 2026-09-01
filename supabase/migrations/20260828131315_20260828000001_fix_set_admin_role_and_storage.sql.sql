-- Revoke anon access to set_admin_role (security hardening)
REVOKE EXECUTE ON FUNCTION set_admin_role FROM anon;

-- Create storage bucket for CMS images (covers, posters, logos, banners)
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-images', 'cms-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, admin write
-- Public read access to cms-images bucket
CREATE POLICY "public_read_cms_images"
ON storage.objects FOR SELECT
TO anon, authenticated
USING (bucket_id = 'cms-images');

-- Admin insert (upload) to cms-images bucket
CREATE POLICY "admin_insert_cms_images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'cms-images'
  AND EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  )
);

-- Admin update to cms-images bucket
CREATE POLICY "admin_update_cms_images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'cms-images'
  AND EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  )
)
WITH CHECK (
  bucket_id = 'cms-images'
  AND EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  )
);

-- Admin delete from cms-images bucket
CREATE POLICY "admin_delete_cms_images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'cms-images'
  AND EXISTS (
    SELECT 1 FROM admin_profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  )
);
