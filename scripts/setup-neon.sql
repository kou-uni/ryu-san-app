-- Neon Database Setup Script
-- Run this SQL in your Neon database console or using psql

-- Create interviews table
CREATE TABLE IF NOT EXISTS interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interviewee_name VARCHAR(255) NOT NULL,
  interview_date DATE NOT NULL,
  content TEXT NOT NULL,
  summary VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for faster searches
CREATE INDEX IF NOT EXISTS idx_interviews_name ON interviews (interviewee_name);
CREATE INDEX IF NOT EXISTS idx_interviews_date ON interviews (interview_date DESC);

-- Optional: Insert sample data (remove if not needed)
INSERT INTO interviews (interviewee_name, interview_date, content, summary) VALUES
  ('山田太郎', '2024-02-01', '茂木の港で50年間漁師をしている山田さん。昔から変わらぬ漁法と海への感謝の気持ちを語ってくれました。', '茂木の港で50年間漁師をしている...'),
  ('佐藤花子', '2024-02-05', '茂木の伝統的な祭りを守り続ける佐藤さん。地域の絆と文化継承の大切さについて熱く語ってくれました。', '茂木の伝統的な祭りを守り続ける...'),
  ('鈴木一郎', '2024-02-10', '茂木で農業を営む鈴木さん。有機農法へのこだわりと地産地消の重要性について教えていただきました。', '茂木で農業を営む鈴木さん。有機...');
