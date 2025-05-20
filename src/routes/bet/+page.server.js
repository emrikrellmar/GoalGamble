export const load = async ({ locals }) => {
  try {
    // Hämtar aktuell session från Supabase
    const { data: { session } } = await locals.supabase.auth.getSession();
    
    // Standardvärden om användaren inte är inloggad
    let user = null;
    let profile = null;
    let pendingBets = [];
    let completedBets = [];
    
    if (session) {
      user = session.user;
      
      // Hämtar användarens profil
      const { data: profileData } = await locals.supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (profileData) {
        profile = profileData;
      }
      
      // Hämtar pågående vad som användaren har lagt
      const { data: pendingBetsData } = await locals.supabase
        .from('bets')
        .eq('user_id', session.user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
      if (pendingBetsData) {
        pendingBets = pendingBetsData;
      }
      
      // Hämtar avslutade vad (vunna eller förlorade)
      const { data: completedBetsData } = await locals.supabase
        .from('bets')
        .eq('user_id', session.user.id)
        .in('status', ['won', 'lost'])
        .order('created_at', { ascending: false })
        .limit(10); // Begränsar till de 10 senaste
        
      if (completedBetsData) {
        completedBets = completedBetsData;
      }
    }
    
    // Returnerar all data som behövs för sidan
    return {
      user,
      profile,
      pendingBets,
      completedBets
    };
  } catch (error) {
    // Vid fel returneras standardvärden
    return {
      user: null,
      profile: null,
      pendingBets: [],
      completedBets: []
    };
  }
};