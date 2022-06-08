import { UserConnectionStatusEnum } from "enums/userConnectionStatus.enum";

export default interface CounterPart {
    id: string;
    login: string;
    avatar: string;
    connectionStatus: UserConnectionStatusEnum;
    tfaSecret: string | null;
    tfaEnabled: boolean;
}