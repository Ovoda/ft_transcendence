import axios from "axios";
import { config } from "../app/config";
import UserData from "../features/user/interfaces/user.interface";
import CreateRoomDto from "./interfaces/CreateRoom.dto";
import { UserRelationsEnum } from "./interfaces/userRelation.enum";

/** Superset of axios, fills baseURL and enables credentials */
export const api = axios.create({
    baseURL: config.getValue("REACT_APP_BACKEND_URL"),
    withCredentials: true
})

/**
 * Fetch current user data from api
 * @returns user data if successfull requests, null otherwise
 */
export async function getUserData(relations?: boolean): Promise<UserData | null | undefined> {
    try {
        const response = await api.get("/user");
        console.log(response.data);

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
        console.log(err.response);
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

/**
 * Fetch all user of the platform
 * @param limit maximum number of user
 * @param page page number
 */
export async function getAllUsers(limit: number, page: number) {
    try {
        const ret = await api.get(`/user/many?limit=${limit}&page=${page}`);
        console.log(ret.data);
        return { data: ret.data, error: "" }
    } catch (error: any) {
        console.log(error.response);
        return { data: null, error: error.response.data.message }
    }
}

/**
 * Create a FRIEND relation between current user and another user
 * @param userId id of the user to be added as friend
 * @returns response data and empty error if successfull, null data and error message otherwise
 */
export async function addFriend(userId: string) {
    try {
        const ret = await api.post("/relation", {
            status: UserRelationsEnum.FRIEND as UserRelationsEnum,
            userId,
        });
        console.log(ret.data);
        return { data: ret.data, error: "" }
    } catch (error: any) {
        console.log(error.response);
        return { data: null, error: error.response.data.message }
    }
}

/**
 * Get current user's friends list
 * @returns current user's friend list or null with an error message
 */
export async function getRelations() {
    try {
        const ret = await api.get("/relation/many");
        return { data: ret.data, error: "" }
    } catch (error: any) {
        return { data: null, error: error.response.data.message }
    }
}