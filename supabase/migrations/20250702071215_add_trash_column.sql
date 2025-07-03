-- Add trash column to chat_sessions table for soft delete
ALTER TABLE chat_sessions ADD COLUMN trash BOOLEAN DEFAULT FALSE;

-- Create index for better performance when filtering non-trashed sessions
CREATE INDEX IF NOT EXISTS idx_chat_sessions_trash ON chat_sessions(trash);

-- Update RLS policies to exclude trashed sessions by default
DROP POLICY "Users can view their own chat sessions" ON chat_sessions;
CREATE POLICY "Users can view their own chat sessions" ON chat_sessions
    FOR SELECT USING ((auth.uid() = user_id OR user_id IS NULL) AND trash = FALSE);

-- Keep update and delete policies as is since they should work with trashed sessions
-- for admin operations if needed