// Use the Supabase project URL and public anon key. Never put a service_role key here.
export const SUPABASE_URL = 'https://taqzzdvszzjqomdsrlbu.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_gjFyOfuwnYQAVJjokADaxg_xEvyFxj7';
export const NEWS_IMAGE_BUCKET = 'news-images';

const SUPABASE_REQUEST_TIMEOUT_MS = 20000;

export async function fetchWithTimeout(input, init = {}) {
    const controller = new AbortController();
    const originalSignal = init.signal;
    const abortFromOriginalSignal = () => controller.abort(originalSignal.reason);
    if (originalSignal?.aborted) {
        abortFromOriginalSignal();
    } else {
        originalSignal?.addEventListener('abort', abortFromOriginalSignal, { once: true });
    }

    const timeoutId = setTimeout(() => {
        controller.abort(new DOMException(
            `Supabase request timed out after ${SUPABASE_REQUEST_TIMEOUT_MS / 1000} seconds.`,
            'TimeoutError'
        ));
    }, SUPABASE_REQUEST_TIMEOUT_MS);

    try {
        return await fetch(input, { ...init, signal: controller.signal });
    } finally {
        clearTimeout(timeoutId);
        originalSignal?.removeEventListener('abort', abortFromOriginalSignal);
    }
}
