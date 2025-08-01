import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xrjrddwrsasjifhghzfl.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhyanJkZHdyc2FzamlmaGdoemZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMzODgxODUsImV4cCI6MjA0ODk2NDE4NX0.O9PHimIQctAGW2nGCpz_oLcJmh4wHY88tL-1JF6P43o'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)