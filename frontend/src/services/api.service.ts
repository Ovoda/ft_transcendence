import axios from "axios";
import { config } from "../app/config";
import UserData from "../features/user/interfaces/user.interface";
import CreateRoomDto from "./interfaces/CreateRoom.dto";


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

export async function createDm(createRoomDto: CreateRoomDto) {
    try {
        await api.post("/chat/create", createRoomDto);
        return { data: await getUserData(), error: "" }
    } catch (error: any) {
        console.log(error);

        if (error.response.status === 404) {
            return { data: null, error: "User not found" };
        }
        return { data: null, error: error.response.data.message };
    }
}