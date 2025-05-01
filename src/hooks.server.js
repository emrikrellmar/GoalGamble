import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
    event.locals.supabase = createClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
        {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
            }
        }
    );

    event.locals.getSession = async () => {
        const { data: { session } } = await event.locals.supabase.auth.getSession();
        return session;
    };
    
    const protectedRoutes = ['/profile'];
    const isProtectedRoute = protectedRoutes.some(route => 
        event.url.pathname === route || event.url.pathname.startsWith(`${route}/`));
    
    if (isProtectedRoute) {
        const session = await event.locals.getSession();
        
        if (!session) {
            throw redirect(303, '/login');
        }
    }

    return resolve(event);
};