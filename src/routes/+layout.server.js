/** 
 * @type {import('./$types').LayoutServerLoad} 
 * Laddar användardata för layout-komponenten
 * Denna funktion körs på server-sidan och gör data tillgänglig för alla sidor
 */
export const load = async ({ locals }) => {
  try {
    // Hämtar användarens session från Supabase
    const { data: { session } } = await locals.supabase.auth.getSession();
    
    // Om ingen session finns (användaren är inte inloggad)
    if (!session) {
      return {
        user: null,
        profile: null
      };
    }
    
    // Hämtar användarens profildata från profiles-tabellen
    const { data: profile } = await locals.supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    // Returnerar användardata och profil som blir tillgänglig för alla sidor
    return {
      user: session.user,
      profile
    };
  } catch (error) {
    // Vid fel returneras null-värden
    return {
      user: null,
      profile: null
    };
  }
};