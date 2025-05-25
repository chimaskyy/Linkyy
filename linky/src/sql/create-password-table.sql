-- Create passwords table
CREATE TABLE IF NOT EXISTS passwords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  encrypted_password TEXT NOT NULL,
  options JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE passwords ENABLE ROW LEVEL SECURITY;

-- Policy for select (read)
CREATE POLICY "Users can view their own passwords"
  ON passwords FOR SELECT
  USING (auth.uid() = user_id);

-- Policy for insert
CREATE POLICY "Users can insert their own passwords"
  ON passwords FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy for update
CREATE POLICY "Users can update their own passwords"
  ON passwords FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for delete
CREATE POLICY "Users can delete their own passwords"
  ON passwords FOR DELETE
  USING (auth.uid() = user_id);

-- Create index
CREATE INDEX IF NOT EXISTS passwords_user_id_idx ON passwords(user_id);
