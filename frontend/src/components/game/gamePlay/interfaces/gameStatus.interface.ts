import { PlayStatusEnum } from "../enums/playStatus.enum";
import { ResultStatusEnum } from "../enums/resultStatus.enum";
import { UserStatusEnum } from "../enums/userStatus.enum";

export default interface GameStatus {
	play: PlayStatusEnum;
	result: ResultStatusEnum;
	user: UserStatusEnum;
}

export const initialGameStatus = {
	play: PlayStatusEnum.OFF,
	result: ResultStatusEnum.UNDEFINED,
	user: UserStatusEnum.UNASSIGNED,
}