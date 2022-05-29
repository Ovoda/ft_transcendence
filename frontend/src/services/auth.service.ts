import Cookies from "js-cookie";
import { api } from "./api.service";

export function login() {
    window.location.href = `http://localhost:3001/auth/user`;
}

export function logout() {
    Cookies.remove("access_token");
    localStorage.removeItem("access_token");
    window.location.reload();
}

export async function loginTfa(code: string) {
    try {
        const res = await api.post("/auth/tfa/authenticate", {
            tfaCode: code,
        });
        Cookies.remove("needs_tfa");
        return true;
    } catch (error: any) {
        console.log(error.response);
        return false;
    }
}
