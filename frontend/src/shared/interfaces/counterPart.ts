import { UserActivityStatusEnum } from "enums/userConnectionStatus.enum";

export default interface CounterPart {
    id: string;
    login: string;
    avatar: string;
    activityStatus: UserActivityStatusEnum;
    tfaSecret: string | null;
    tfaEnabled: boolean;
}