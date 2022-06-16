import { config } from "../app/config";
import { api } from "./api.service";

/** Redirects to 42 auth login page */
export function login() {
    window.location.href = config.getValue("REACT_APP_BACKEND_URL") + "/auth/user";
}

/** Logs out current user */
export async function logout() {
    try {
        await api.get("/auth/logout");
        window.location.reload();
    } catch (err: any) {
    }
}

/**
 * Attempts to login current user using TFA
 * @param code TFA code
 * @returns true if user is authenticated, false otherwise
 */
export async function loginTfa(code: string) {
    try {
        await api.post("/auth/tfa/authenticate", {
            tfaCode: code,
        });
        return true;
    } catch (error: any) {
        return false;
    }
}
