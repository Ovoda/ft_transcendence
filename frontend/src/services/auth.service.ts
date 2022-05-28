import Cookies from "js-cookie";

export function login() {
    window.location.href = `http://localhost:3001/auth/user`;
}

export function logout() {
    Cookies.remove("access_token");
    localStorage.removeItem("access_token");
    window.location.reload();
}