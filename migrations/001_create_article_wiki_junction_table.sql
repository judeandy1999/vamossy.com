-- Migration: Create article_wiki junction table and migrate existing data
-- Created: 2025-10-29
-- Description: Creates many-to-many relationship between articles and categories

-- Create the junction table
CREATE TABLE article_wiki (
  article_id INTEGER REFERENCES articles(id) ON DELETE CASCADE,
  wiki_id INTEGER REFERENCES category_options(id) ON DELETE CASCADE,
  PRIMARY KEY(article_id, wiki_id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_article_wiki_article_id ON article_wiki(article_id);
CREATE INDEX idx_article_wiki_wiki_id ON article_wiki(wiki_id);

-- Migration script to populate article_wiki junction table with existing data
INSERT INTO article_wiki (article_id, wiki_id)
SELECT id, wiki_id 
FROM articles 
WHERE wiki_id IS NOT NULL;

-- Add comment for documentation
COMMENT ON TABLE article_wiki IS 'Junction table for many-to-many relationship between articles and wiki categories';