// Conexión con el Supabase de NorDrive (el mismo que usa la app de gestión).
// La clave "anon" es pública por diseño: lo que puede leer cada cliente lo deciden las reglas (RLS)
// de supabase/2026-10_area_clientes.sql en la app de gestión. Nunca pongas aquí la clave secreta (service_role).
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://luzacvchtxkurisuywic.supabase.co"
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1emFjdmNodHhrdXJpc3V5d2ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3NjQzODMsImV4cCI6MjA4MDM0MDM4M30.7K5KdBzxQoQutRYUOd5sE2-r5fOWPXGsHKyov0BSB3U"

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    // el enlace del correo vuelve a /clientes/ con la sesión en la URL (web estática, sin servidor)
    detectSessionInUrl: true,
    flowType: "implicit",
    storageKey: "nordrive-clientes-auth",
  },
})

/** Bucket privado con las fotos y documentos del área de clientes */
export const PORTAL_BUCKET = "client-portal"
