import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    'https://cumpprlorkinrlvdbigt.supabase.co'
    ,
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1bXBwcmxvcmtpbnJsdmRiaWd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIxMDg3NDUsImV4cCI6MjAyNzY4NDc0NX0.g-xOF9V4ec2dzrrduqpKR50Q5zlBjFWcsRKjmaSSx78'
    )
}