import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import { createClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
    // Skapar en Supabase-klient och sparar den i event.locals för åtkomst i hela appen
    event.locals.supabase = createClient(
        PUBLIC_SUPABASE_URL,
        PUBLIC_SUPABASE_ANON_KEY,
        {
            auth: {
                persistSession: true,  // Sparar sessionen i localStorage
                autoRefreshToken: true,  // Uppdaterar token automatiskt när den närmar sig utgång
            }
        }
    );

    // Skapar en hjälpfunktion för att hämta den aktuella användarens session och sparar den i event.locals för enkel åtkomst i andra delar av applikationen
    event.locals.getSession = async () => {
        const { data: { session } } = await event.locals.supabase.auth.getSession();
        return session;
    };
    
    // Lista över skyddade rutter som kräver autentisering
    const protectedRoutes = ['/profile'];
    
    // Kontrollerar om den aktuella rutten är skyddad 
    const isProtectedRoute = protectedRoutes.some(route => 
        event.url.pathname === route || event.url.pathname.startsWith(`${route}/`));
    
    // Om det är en skyddad rutt, kontrollera om användaren är inloggad
    if (isProtectedRoute) {
        // Hämtar sessionen med hjälpfunktionen
        const session = await event.locals.getSession();
        
        // if ingen session = användaren är inte inloggad
        if (!session) {
            throw redirect(303, '/login');
        }
    }

    // Fortsätter med förfrågans bearbetning efter autentiseringskontroll
    return resolve(event);
};