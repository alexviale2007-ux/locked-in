import { createClient } from "@supabase/supabase-js";
export const supabase = createClient(
  "https://yfpbicdeqtfrxthxdule.supabase.co",
  "sb_publishable_Y5qeMKnDPxi_IxwBgzdqgQ_ujvwZHr1",
  { auth: { persistSession: true, autoRefreshToken: true } }
);
