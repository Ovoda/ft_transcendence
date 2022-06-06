import { UserStatusEnum } from "../enums/userStatus.enum";

export default interface GameStatus {
    start: boolean;
    ready: boolean;
    win: string;
    side: UserStatusEnum;
	watch: boolean;
}

export const initialGameStatus = {
    start: true,
    ready: false,
    win: "",
    side: UserStatusEnum.UNASSIGNED,
	watch: false,
}