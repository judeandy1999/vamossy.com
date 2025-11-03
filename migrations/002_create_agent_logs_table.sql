-- Create agent_logs table
CREATE TABLE IF NOT EXISTS agent_logs (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  session_id TEXT,
  agent TEXT NOT NULL,
  input TEXT NOT NULL,
  output TEXT NOT NULL,
  lead_score INTEGER DEFAULT 0,
  version TEXT DEFAULT 'Vamossy-Agents-1.0.0',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_agent_logs_user_id ON agent_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_agent_logs_agent ON agent_logs(agent);
CREATE INDEX IF NOT EXISTS idx_agent_logs_timestamp ON agent_logs(timestamp);
CREATE INDEX IF NOT EXISTS idx_agent_logs_lead_score ON agent_logs(lead_score);