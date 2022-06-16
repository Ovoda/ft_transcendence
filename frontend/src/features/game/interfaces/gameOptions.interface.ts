import UserData from "features/user/interfaces/user.interface";

export interface GameOptions {
	gameIsPrivate: boolean;
	requestingUser: UserData | null;
	requestedUserId: string;
	showPrivateGameModal: boolean;
}