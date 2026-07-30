type AuthSession = {
  auth: boolean;
  accessKey: string;
};

const AUTH_FLAG_KEY = "auth";
const ACCESS_KEY_KEY = "accessKey";
const FALLBACK_KEY = "__DPG_TRAINING_AUTH__";

const getFallback = (): AuthSession => {
  return (globalThis as any)[FALLBACK_KEY] ?? { auth: false, accessKey: "" };
};

const setFallback = (next: AuthSession) => {
  (globalThis as any)[FALLBACK_KEY] = next;
};

export const getAuthSession = (): AuthSession => {
  if (typeof window === "undefined") return getFallback();

  try {
    const auth = window.sessionStorage.getItem(AUTH_FLAG_KEY) === "1";
    const accessKey = window.sessionStorage.getItem(ACCESS_KEY_KEY) ?? "";
    const next = { auth, accessKey };
    setFallback(next);
    return next;
  } catch {
    return getFallback();
  }
};

export const setAuthSession = (accessKey: string): void => {
  const next = { auth: true, accessKey };

  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.setItem(AUTH_FLAG_KEY, "1");
      window.sessionStorage.setItem(ACCESS_KEY_KEY, accessKey);
    } catch {
      // Some browsers or privacy modes may block storage writes.
    }
  }

  setFallback(next);
};

export const clearAuthSession = (): void => {
  if (typeof window !== "undefined") {
    try {
      window.sessionStorage.clear();
    } catch {
      // Ignore storage clear failures and reset fallback state.
    }
  }

  setFallback({ auth: false, accessKey: "" });
};
