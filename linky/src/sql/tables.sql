VITE_SUPABASE_URL=https://rknrgyeuummleggkcozq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJrbnJneWV1dW1tbGVnZ2tjb3pxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMDUzMzQsImV4cCI6MjA2Mjg4MTMzNH0.2GDhax3AtJMrGgXJ5c8rn_GxE1wEh2O2FLnr4rVmdZs

-- Create tables for users, shortened URLs, and link trees

-- URLs table to store shortened URLs
CREATE TABLE IF NOT EXISTS urls (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  short_code VARCHAR(10) NOT NULL UNIQUE,
  title VARCHAR(255),
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Link trees table
CREATE TABLE IF NOT EXISTS link_trees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) NOT NULL UNIQUE,
  title VARCHAR(100),
  bio TEXT,
  theme VARCHAR(50) DEFAULT 'dark',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Links within link trees
CREATE TABLE IF NOT EXISTS tree_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tree_id UUID REFERENCES link_trees(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  icon VARCHAR(50),
  position INTEGER,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS urls_user_id_idx ON urls(user_id);
CREATE INDEX IF NOT EXISTS link_trees_user_id_idx ON link_trees(user_id);
CREATE INDEX IF NOT EXISTS tree_links_tree_id_idx ON tree_links(tree_id);
CREATE INDEX IF NOT EXISTS urls_short_code_idx ON urls(short_code);
CREATE INDEX IF NOT EXISTS link_trees_username_idx ON link_trees(username);

-- Create RLS policies
ALTER TABLE urls ENABLE ROW LEVEL SECURITY;
ALTER TABLE link_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE tree_links ENABLE ROW LEVEL SECURITY;

-- URLs policies
CREATE POLICY "Users can view their own URLs"
  ON urls FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own URLs"
  ON urls FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own URLs"
  ON urls FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own URLs"
  ON urls FOR DELETE
  USING (auth.uid() = user_id);

-- Link trees policies
CREATE POLICY "Users can view their own link trees"
  ON link_trees FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own link trees"
  ON link_trees FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own link trees"
  ON link_trees FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own link trees"
  ON link_trees FOR DELETE
  USING (auth.uid() = user_id);

-- Tree links policies
CREATE POLICY "Users can view their own tree links"
  ON tree_links FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM link_trees
    WHERE link_trees.id = tree_links.tree_id
    AND link_trees.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert their own tree links"
  ON tree_links FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM link_trees
    WHERE link_trees.id = tree_links.tree_id
    AND link_trees.user_id = auth.uid()
  ));

CREATE POLICY "Users can update their own tree links"
  ON tree_links FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM link_trees
    WHERE link_trees.id = tree_links.tree_id
    AND link_trees.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete their own tree links"
  ON tree_links FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM link_trees
    WHERE link_trees.id = tree_links.tree_id
    AND link_trees.user_id = auth.uid()
  ));

-- Public access policies for shortened URLs and link trees
CREATE POLICY "Anyone can view public URLs by short code"
  ON urls FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view public link trees by username"
  ON link_trees FOR SELECT
  USING (true);

CREATE POLICY "Anyone can view public tree links"
  ON tree_links FOR SELECT
  USING (true);