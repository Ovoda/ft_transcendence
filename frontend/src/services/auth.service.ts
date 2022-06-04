import Cookies from "js-cookie";
import { config } from "../app/config";
import { api } from "./api.service";

export function login() {
    window.location.href = config.getValue("REACT_APP_BACKEND_URL") + "/auth/user";
}

export async function logout() {
    Cookies.remove("authentication");
    const res = await api.get("/auth/logout");
    console.log(res);
    window.location.reload();
}

export async function loginTfa(code: string) {
    try {
        await api.post("/auth/tfa/authenticate", {
            tfaCode: code,
        });
        return true;
    } catch (error: any) {
        console.log(error.response);
        return false;
    }
}
