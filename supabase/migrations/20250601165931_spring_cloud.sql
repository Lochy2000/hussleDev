-- Create the hustles table
CREATE TABLE hustles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  status TEXT NOT NULL CHECK (status IN ('saved', 'in-progress', 'launched')),
  user_id UUID NOT NULL,
  notes TEXT,
  time_commitment TEXT NOT NULL CHECK (time_commitment IN ('low', 'medium', 'high')),
  earning_potential TEXT NOT NULL CHECK (time_commitment IN ('low', 'medium', 'high')),
  image TEXT NOT NULL,
  tools TEXT[] NOT NULL DEFAULT '{}'
);

-- Create indexes
CREATE INDEX hustles_user_id_idx ON hustles(user_id);
CREATE INDEX hustles_status_idx ON hustles(status);

-- Enable Row Level Security
ALTER TABLE hustles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own hustles"
  ON hustles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own hustles"
  ON hustles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own hustles"
  ON hustles FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own hustles"
  ON hustles FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_hustles_updated_at
  BEFORE UPDATE ON hustles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();