import Cookies from "js-cookie";
import { config } from "../app/config";
import { api } from "./api.service";

export function login() {
    window.location.href = config.getValue("REACT_APP_BACKEND_URL") + "/auth/user";
}

export function logout() {
    Cookies.remove("access_token");
    window.location.reload();
}

export async function loginTfa(code: string) {
    try {
        const res = await api.post("/auth/tfa/authenticate", {
            tfaCode: code,
        });
        if (res) {
            console.log(res.data);

            Cookies.remove("needs_tfa");
            Cookies.set("access_token", res.data.access_token);
        }
        return true;
    } catch (error: any) {
        console.log(error.response);
        return false;
    }
}
