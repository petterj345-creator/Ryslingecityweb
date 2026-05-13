import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://tbrxmabkjkwmlspdsghb.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_X9XzVIV2cOEfY4xgQrAuTg_PfFDP";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
