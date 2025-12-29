-- Create a table to store Semaphore Identities securely
CREATE TABLE IF NOT EXISTS public.identities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    private_key TEXT NOT NULL, -- Encrypted or base64 (with RLS, only user can access)
    commitment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE public.identities ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own identity" 
ON public.identities FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own identity" 
ON public.identities FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own identity" 
ON public.identities FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own identity" 
ON public.identities FOR DELETE 
USING (auth.uid() = user_id);
