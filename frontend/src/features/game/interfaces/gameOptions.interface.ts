import UserData from "features/user/interfaces/user.interface";

export interface GameOptions {
	fastModeActivated: boolean;
	longModeActivated: boolean;
	playingFriendRequest: boolean;
	showFriendRequest: UserData | null;
}