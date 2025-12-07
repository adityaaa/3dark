-- Check if Customer table exists and its structure
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'Customer';

-- If it exists, show its columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'Customer'
ORDER BY ordinal_position;
