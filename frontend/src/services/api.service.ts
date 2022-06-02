import axios from "axios";
import { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";
import { config } from "../app/config";
import UserData from "../features/user/interfaces/user.interface";


export const api = axios.create({
    baseURL: config.getValue("REACT_APP_BACKEND_URL"),
})

api.interceptors.request.use(
    (config: AxiosRequestConfig) => {

        const token = Cookies.get("access_token");

        if (token && config.headers) {
            config.headers["Authorization"] = "Bearer " + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
)

export async function getUserData(): Promise<UserData | null | undefined> {
    try {
        if (Cookies.get("access_token") === null) return null;

        const response = await api.get("/user");
        return response.data as UserData;
    } catch (error: any) {
        console.log(error.response);
    }
}