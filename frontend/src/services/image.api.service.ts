import { api } from "./api.service"

export async function updateUserAvatar(file: File) {
    try {
        const data = new FormData();
        data.append("file", file);

        const response = await api.post(`/images/user/upload`, data);
        return { imageUploaded: response.data, error: "" };
    } catch (error: any) {
        console.log(error.response);
        return { imageUploaded: null, error: error.response.data.message };
    }
}

export async function uploadGroupAvatar(file: File, groupId: string) {
    try {
        const data = new FormData();
        data.append("file", file);

        const response = await api.post(`/images/group/upload/${groupId}`, data);
        return { imageUploaded: response.data, error: "" };
    } catch (error: any) {
        return { imageUploaded: null, error: error.response.data.message };
    }
}