import UserData from "./user.interface";

export interface UdpateUserAction {
    payload: UserData;
    type: string;
}
