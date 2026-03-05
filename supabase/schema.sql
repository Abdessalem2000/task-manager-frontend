-- TaskForce Mobile Database Schema for Supabase
-- GPS Sales Tracker for Algerian Agencies

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clients/Prospects table
CREATE TABLE clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,
  lat FLOAT, 
  lng FLOAT, -- GPS coordinates
  status TEXT CHECK (status IN ('new','contacted','visited','closed')) DEFAULT 'new',
  score INTEGER CHECK (score >= 0 AND score <= 100) DEFAULT 0, -- AI score
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Visits table (like Silwane tours)
CREATE TABLE visits (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lat FLOAT, 
  lng FLOAT,
  notes TEXT,
  status TEXT CHECK (status IN ('planned','in_progress','completed','cancelled')) DEFAULT 'planned',
  checkin_time TIMESTAMP WITH TIME ZONE,
  checkout_time TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Users profile extension
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  agency_name TEXT,
  phone TEXT,
  role TEXT DEFAULT 'sales_rep',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI scoring logs
CREATE TABLE ai_scoring_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  factors JSONB, -- AI scoring factors
  model_version TEXT DEFAULT 'v1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Offline sync queue
CREATE TABLE sync_queue (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  operation TEXT NOT NULL, -- 'create', 'update', 'delete'
  table_name TEXT NOT NULL,
  data JSONB NOT NULL,
  status TEXT CHECK (status IN ('pending','synced','failed')) DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  synced_at TIMESTAMP WITH TIME ZONE
);

-- Indexes for performance
CREATE INDEX idx_clients_status ON clients(status);
CREATE INDEX idx_clients_score ON clients(score DESC);
CREATE INDEX idx_visits_user_id ON visits(user_id);
CREATE INDEX idx_visits_client_id ON visits(client_id);
CREATE INDEX idx_visits_status ON visits(status);
CREATE INDEX idx_visits_created_at ON visits(created_at DESC);
CREATE INDEX idx_sync_queue_user_status ON sync_queue(user_id, status);

-- RLS (Row Level Security) Policies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_scoring_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;

-- Clients policies
CREATE POLICY "Users can view their own agency clients" ON clients
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM user_profiles 
      WHERE agency_name = (SELECT agency_name FROM user_profiles WHERE id = auth.uid())
    )
  );

CREATE POLICY "Users can insert clients" ON clients
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own clients" ON clients
  FOR UPDATE USING (
    auth.uid() IN (
      SELECT user_id FROM user_profiles 
      WHERE agency_name = (SELECT agency_name FROM user_profiles WHERE id = auth.uid())
    )
  );

-- Visits policies
CREATE POLICY "Users can view their own visits" ON visits
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can manage their own visits" ON visits
  FOR ALL USING (user_id = auth.uid());

-- User profiles policies
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (id = auth.uid());

-- Sync queue policies
CREATE POLICY "Users can manage their sync queue" ON sync_queue
  FOR ALL USING (user_id = auth.uid());

-- AI scoring logs policies
CREATE POLICY "Users can view AI scores for their clients" ON ai_scoring_logs
  FOR SELECT USING (
    auth.uid() IN (
      SELECT user_id FROM user_profiles 
      WHERE agency_name = (SELECT agency_name FROM user_profiles WHERE id = auth.uid())
    )
  );

-- Functions for automatic timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_visits_updated_at BEFORE UPDATE ON visits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate visit duration
CREATE OR REPLACE FUNCTION calculate_visit_duration()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.checkin_time IS NOT NULL AND NEW.checkout_time IS NOT NULL THEN
        NEW.duration_minutes = EXTRACT(EPOCH FROM (NEW.checkout_time - NEW.checkin_time)) / 60;
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_visit_duration_trigger BEFORE UPDATE ON visits
    FOR EACH ROW EXECUTE FUNCTION calculate_visit_duration();
