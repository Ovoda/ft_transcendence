import Group from "src/shared/interfaces/group.interface";
import { api } from "./api.service";

/**
 * Get all groups of the plateform
 * @returns groups if successful, null and error message otherwise
 */
export async function getAllGroups() {
    try {
        const ret = await api.get("/chat/group/many");
        return { groups: ret.data, error: "" };
    } catch (error: any) {
        console.log(error.response);
        return { groups: null, error: error.response.data.message };
    }
}

/**
 * Get a specific chat group
 * @param groupId ID of the group to get
 * @returns group with users relations
 */
export async function getGroup(groupId: string): Promise<{ group: Group | null, error: string }> {
    try {
        const response = await api.get(`/chat/group/find/${groupId}`);
        return { group: response.data, error: "" }
    } catch (error: any) {
        return { group: null, error: error.response.data.message };
    }
}
/**
 * Joins a group with or without a password
 * @param groupId ID of the group to join
 * @param password password of the group to join
 * @returns response or error message
 */
export async function joinGroup(groupId: string, password: string = "") {
    try {
        const ret = await api.patch("/chat/group/join", {
            groupId,
            password,
        });
        return { response: ret.data, error: "" }
    } catch (error: any) {
        return { response: null, error: error.response.data.message }
    }
}

export async function leaveGroup(groupId: string, roleId: string) {
    try {
        const response = await api.patch(`/chat/group/kick/${groupId}/${roleId}`);
        return { response: response.data, error: "" };
    } catch (error: any) {
        console.log(error.response);
        return { response: null, error: error.response.message.data };
    }
}

export async function deleteGroup(groupId: string, roleId: string) {
    try {
        const response = await api.delete(`/chat/group/${groupId}/${roleId}`);
        return { response: response.data, error: "" };
    } catch (error: any) {
        console.log(error.response);
        return { response: null, error: error.response.message.data };
    }
}

/**
 * Check if a group is password protected
 * @param groupId ID of the group to check
 * @returns boolean or error
 */
export async function checkGroupProtection(groupId: string) {
    try {
        //console.log("here");
        const ret = await api.get(`/chat/group/protected/${groupId}`);
        console.log("checkGroupPro:", ret.data);
        return { isProtected: ret.data, error: "" }
    } catch (error: any) {
        return { response: null, error: error.response.data.message }
    }
}

export async function kickFromGroup(groupId: string, roleId: string) {
    try {
        const response = await api.patch(`/chat/group/kick/${groupId}/${roleId}`);
        return { response: response.data, error: "" };
    } catch (error: any) {
        console.log(error.response);
        return { response: null, error: error.response.message.data };
    }
}