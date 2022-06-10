import axios from "axios";
import { RoleTypeEnum } from "enums/roleType.enum";
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
export async function getUserData(): Promise<UserData | null | undefined> {
    try {
        const response = await api.get("/user");
        return response.data as UserData;
    } catch (error: any) {
        // console.log(error.response);
    }
}

export async function getMessages(lastMessage: string, roleId: string = "") {
    if (!lastMessage) return { messages: [], error: "Last message is null" };
    try {
        const url = (roleId === "") ? `chat/many/message/dm/${lastMessage}` : `chat/many/message/group/${roleId}/${lastMessage}`;
        const response = await api.get(url);
        return { messages: response.data, error: "" };
    } catch (error: any) {
        return { messages: null, error: error.response.data.message };
    }
}

/**
 * Create a DM chat room (add friend)
 * @param createRoomDto DTO for chatroom creation
 * @returns data and empty error if successfull, null data and error message otherwise
 */
export async function createRoom(createRoomDto: CreateRoomDto) {
    try {
        const group = await api.post("/chat/group/create", createRoomDto);
        console.log(group);
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
        return { data: ret.data, error: "" }
    } catch (error: any) {
        return { data: null, error: error.response.data.message }
    }
}

/**
 * Get current user's friends list
 * @returns current user's friend list or null with an error message
 */
export async function getAllRelations() {
    try {
        const ret = await api.get("/relation/many");
        console.log(ret.data);
        return { data: ret.data, error: "" }
    } catch (error: any) {
        return { data: null, error: error.response.data.message }
    }
}

export async function getRelation(relationId: string) {
    try {
        const ret = await api.get(`/relation/${relationId}`);
        return { data: ret.data, error: "" }
    } catch (error: any) {
        return { data: null, error: error.response.data.message };
    }
}

export async function getAllRoles() {
    try {
        const ret = await api.get("/chat/all/roles");
        return { data: ret.data, error: "" }
    } catch (error: any) {
        return { data: null, error: error.response.data.message }
    }
}

export async function getRole(roleId: string) {
    try {
        const ret = await api.get(`/chat/role/${roleId}`);
        return { data: ret.data, error: "" }
    } catch (error: any) {
        return { data: null, error: error.response.data.message };
    }
}

export async function updateUserRole(userId: string, groupId: string, newRole: RoleTypeEnum) {
    try {
        const ret = await api.post("/chat/change/group/role", {
            userId,
            groupId,
            newRole
        });
        console.log(ret);
        return true;
    } catch (error: any) {
        console.log(error.response);
        return false;
    }
}