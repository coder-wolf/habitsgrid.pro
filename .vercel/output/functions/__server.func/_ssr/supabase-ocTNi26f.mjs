import { t as createClient } from "../_libs/supabase__supabase-js.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/supabase-ocTNi26f.js
var supabaseUrl = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_M1Xbbgr6hOQAxrgonC0y_g_NNNaKWxf",
	"VITE_SUPABASE_URL": "https://cqsycpcdojhvhumlkzug.supabase.co"
}["VITE_SUPABASE_URL"];
var publishableKey = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_SUPABASE_PUBLISHABLE_KEY": "sb_publishable_M1Xbbgr6hOQAxrgonC0y_g_NNNaKWxf",
	"VITE_SUPABASE_URL": "https://cqsycpcdojhvhumlkzug.supabase.co"
}["VITE_SUPABASE_PUBLISHABLE_KEY"];
var isSupabaseConfigured = Boolean(supabaseUrl && publishableKey);
var supabase = isSupabaseConfigured ? createClient(supabaseUrl, publishableKey, { auth: {
	persistSession: true,
	detectSessionInUrl: true,
	autoRefreshToken: true
} }) : null;
//#endregion
export { supabase as n, isSupabaseConfigured as t };
