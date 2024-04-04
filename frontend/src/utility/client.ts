import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    "https://rrzufyvihrhlnprspyvh.supabase.co"
    ,
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJyenVmeXZpaHJobG5wcnNweXZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDk4NTkyNzksImV4cCI6MjAyNTQzNTI3OX0.SoZusxJyuRrcdf-lNlRUxlDAV15A7bLb7ICyK63Mztk"    )
}