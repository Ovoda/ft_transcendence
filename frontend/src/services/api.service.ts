import axios from "axios";
import { config } from "../app/config";
import UserData from "../features/user/interfaces/user.interface";


export const api = axios.create({
    baseURL: config.getValue("REACT_APP_BACKEND_URL"),
    withCredentials: true
})

export async function getUserData(): Promise<UserData | null | undefined> {
    try {
        const response = await api.get("/user");
        return response.data as UserData;
    } catch (error: any) {
        console.log(error.response);
    }
}