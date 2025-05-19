import { redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase } }) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
        throw redirect(303, '/'); // Om inloggad, gå till huvudsida
    }
    
    return {};
};