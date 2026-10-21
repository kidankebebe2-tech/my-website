export async function isAdminUser(supabase, user) {
    if (!user) return false;
    if (user.app_metadata?.role === 'admin') return true;

    const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();
    if (error) throw error;
    if (data?.role === 'admin') return true;

    const { data: legacyAdmin, error: legacyAdminError } = await supabase
        .from('admin_users')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle();
    if (legacyAdminError) throw legacyAdminError;
    return Boolean(legacyAdmin);
}

export async function refreshAuthSession(supabase) {
    const { data, error } = await supabase.auth.refreshSession();
    if (error) throw error;
    return data.session;
}
