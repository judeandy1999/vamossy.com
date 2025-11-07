-- Add article_lists table
CREATE TABLE public.article_lists (
  id integer generated always as identity not null,
  name text not null,
  description text null,
  created_at timestamp without time zone null default now(),
  updated_at timestamp without time zone null default now(),
  constraint article_lists_pkey primary key (id)
) TABLESPACE pg_default;

-- Add article_list_id column to articles table
ALTER TABLE public.articles 
ADD COLUMN article_list_id integer null,
ADD CONSTRAINT articles_article_list_id_fkey 
FOREIGN KEY (article_list_id) REFERENCES article_lists (id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX idx_articles_article_list_id ON public.articles (article_list_id);

-- Insert some default article lists (optional)
INSERT INTO public.article_lists (name, description) VALUES 
('General Articles', 'General purpose articles'),
('Technical Documentation', 'Technical guides and documentation'),
('Blog Posts', 'Blog articles and news');