import UserRole from "src/shared/interfaces/role.interface";

export default interface OpenChatGroup {
    payload: {
        role: UserRole;
        messages: any[];
    },
    type: string;
}