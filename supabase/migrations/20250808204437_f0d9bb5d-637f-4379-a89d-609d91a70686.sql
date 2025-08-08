-- Create RLS policies for business-logos bucket

-- Allow authenticated users to view all business logos (public bucket)
CREATE POLICY "Business logos are publicly viewable" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'business-logos');

-- Allow authenticated users to upload their own business logos
CREATE POLICY "Users can upload business logos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'business-logos' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to update their own business logos
CREATE POLICY "Users can update business logos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'business-logos' 
  AND auth.role() = 'authenticated'
);

-- Allow authenticated users to delete their own business logos
CREATE POLICY "Users can delete business logos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'business-logos' 
  AND auth.role() = 'authenticated'
);