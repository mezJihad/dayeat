-- Create a public bucket named 'menus'
insert into storage.buckets (id, name, public)
values ('menus', 'menus', true);

-- Policy to allow public access to view files
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'menus' );

-- Policy to allow authenticated users to upload files
create policy "Authenticated Uploads"
  on storage.objects for insert
  with check (
    bucket_id = 'menus'
    and auth.role() = 'authenticated'
  );
