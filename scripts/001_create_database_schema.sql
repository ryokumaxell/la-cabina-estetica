-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  date_of_birth DATE,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  medical_conditions TEXT,
  allergies TEXT,
  medications TEXT,
  skin_type TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create procedures table
CREATE TABLE IF NOT EXISTS public.procedures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  duration_minutes INTEGER,
  price DECIMAL(10,2),
  category TEXT,
  requirements TEXT,
  contraindications TEXT,
  aftercare_instructions TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create appointments table
CREATE TABLE IF NOT EXISTS public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  procedure_id UUID REFERENCES public.procedures(id),
  appointment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create treatment_records table
CREATE TABLE IF NOT EXISTS public.treatment_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  appointment_id UUID REFERENCES public.appointments(id),
  procedure_id UUID REFERENCES public.procedures(id),
  treatment_date TIMESTAMP WITH TIME ZONE NOT NULL,
  pre_treatment_notes TEXT,
  treatment_details TEXT,
  post_treatment_notes TEXT,
  products_used TEXT,
  next_appointment_recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create treatment_photos table
CREATE TABLE IF NOT EXISTS public.treatment_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  treatment_record_id UUID NOT NULL REFERENCES public.treatment_records(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_type TEXT CHECK (photo_type IN ('before', 'during', 'after')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procedures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatment_photos ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Create RLS policies for clients
CREATE POLICY "clients_select_own" ON public.clients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "clients_insert_own" ON public.clients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "clients_update_own" ON public.clients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "clients_delete_own" ON public.clients FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for procedures
CREATE POLICY "procedures_select_own" ON public.procedures FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "procedures_insert_own" ON public.procedures FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "procedures_update_own" ON public.procedures FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "procedures_delete_own" ON public.procedures FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for appointments
CREATE POLICY "appointments_select_own" ON public.appointments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "appointments_insert_own" ON public.appointments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "appointments_update_own" ON public.appointments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "appointments_delete_own" ON public.appointments FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for treatment_records
CREATE POLICY "treatment_records_select_own" ON public.treatment_records FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "treatment_records_insert_own" ON public.treatment_records FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "treatment_records_update_own" ON public.treatment_records FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "treatment_records_delete_own" ON public.treatment_records FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for treatment_photos
CREATE POLICY "treatment_photos_select_own" ON public.treatment_photos FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "treatment_photos_insert_own" ON public.treatment_photos FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "treatment_photos_update_own" ON public.treatment_photos FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "treatment_photos_delete_own" ON public.treatment_photos FOR DELETE USING (auth.uid() = user_id);
