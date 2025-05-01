export const load = async ({ locals }) => {
    try {
      const { data: { session } } = await locals.supabase.auth.getSession();
      
      let user = null;
      let profile = null;
      let matches = [];
      let pendingBets = [];
      let completedBets = [];
      
      if (session) {
        user = session.user;
        
        const { data: profileData } = await locals.supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
          
        if (profileData) {
          profile = profileData;
        }
        
        const { data: pendingBetsData } = await locals.supabase
          .from('bets')
          .select('*, matches(*)')
          .eq('user_id', session.user.id)
          .eq('status', 'pending')
          .order('created_at', { ascending: false });
          
        if (pendingBetsData) {
          pendingBets = pendingBetsData;
        }
        
        const { data: completedBetsData } = await locals.supabase
          .from('bets')
          .select('*, matches(*)')
          .eq('user_id', session.user.id)
          .in('status', ['won', 'lost'])
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (completedBetsData) {
          completedBets = completedBetsData;
        }
      }
      
      const { data: matchesData } = await locals.supabase
        .from('matches')
        .select('*')
        .eq('status', 'upcoming')
        .order('match_time', { ascending: true });
        
      if (matchesData) {
        matches = matchesData;
      }
      
      return {
        user,
        profile,
        matches,
        pendingBets,
        completedBets
      };
    } catch (error) {
      
      return {
        user: null,
        profile: null,
        matches: [],
        pendingBets: [],
        completedBets: []
      };
    }
  };