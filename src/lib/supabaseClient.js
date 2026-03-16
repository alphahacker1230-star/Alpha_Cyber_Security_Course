import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://nssmbytspsdhyymltetb.supabase.co"
const supabaseKey = "sb_publishable_G8xvoYvayXKNEvonmBGV7g_294mJL_V"

export const supabase = createClient(supabaseUrl, supabaseKey)
