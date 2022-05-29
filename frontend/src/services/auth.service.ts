import axios from "axios";
import Cookies from "js-cookie";
import { openTfaRegistration } from "src/features/uiState/uiState.slice";
import { updateQrCode } from "../features/auth/auth.slice";

export function login() {
    window.location.href = `http://localhost:3001/auth/user`;
}

export function logout() {
    Cookies.remove("access_token");
    localStorage.removeItem("access_token");
    window.location.reload();
}

