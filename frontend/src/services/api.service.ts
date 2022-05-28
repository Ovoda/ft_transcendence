import axios from "axios";
import { AxiosRequestConfig } from "axios";
import UserData from "../features/user/interfaces/user.interface";


export const api = axios.create({
    baseURL: "http://localhost:3001",
})

api.interceptors.request.use(
    (config: AxiosRequestConfig) => {

        const token = localStorage.getItem("access_token");

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
        if (localStorage.getItem("access_token") === null) return null;
        const response = await api.get("/user");
        return response.data as UserData;
    } catch (error: any) {
        console.log(error.response);
    }
}