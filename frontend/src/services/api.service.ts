import axios from "axios";
import { config } from "../app/config";
import UserData from "../features/user/interfaces/user.interface";
import CreateRoomDto from "./interfaces/CreateRoom.dto";

/** Superset of axios, fills baseURL and enables credentials */
export const api = axios.create({
    baseURL: config.getValue("REACT_APP_BACKEND_URL"),
    withCredentials: true
})

/**
 * Fetch current user data from api
 * @returns user data if successfull requests, null otherwise
 */
export async function getUserData(): Promise<UserData | null | undefined> {
    try {
        const response = await api.get("/user");
        return response.data as UserData;
    } catch (error: any) {
        // console.log(error.response);
    }
}

export async function getPreviousMessages(roleId: string, messageId: string | null) {
    try {
        if (!messageId) return [];
        const ret = await api.get(`/chat/many/messages/${roleId}/${messageId}?limit=20`);
        return (ret.data);
    } catch (err: any) {
        // console.log(err.response);
    }
}

/**
 * Create a DM chat room (add friend)
 * @param createRoomDto DTO for chatroom creation
 * @returns data and empty error if successfull, null data and error message otherwise
 */
export async function createRoom(createRoomDto: CreateRoomDto) {
    try {
        await api.post("/chat/create", createRoomDto);
        return { data: await getUserData(), error: "" }
    } catch (error: any) {
        if (error.response.status === 404) {
            return { data: null, error: "User not found" };
        }
        return { data: null, error: error.response.data.message };
    }
}