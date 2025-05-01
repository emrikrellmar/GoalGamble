/** @type {import('./$types').LayoutServerLoad} */
export const load = async ({ locals }) => {
  try {
    const { data: { session } } = await locals.supabase.auth.getSession();
    
    if (!session) {
      return {
        user: null,
        profile: null
      };
    }
    
    // Load profile data
    const { data: profile } = await locals.supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    return {
      user: session.user,
      profile
    };
  } catch (error) {
    return {
      user: null,
      profile: null
    };
  }
};