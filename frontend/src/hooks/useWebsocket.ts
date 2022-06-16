import { addMessage, closeChat, showChat } from "features/chat/chat.slice";
import { setGameIsPrivate, setRequestedUser, setRequestingUser, setShowPrivateGameModal } from "features/game/game.slice";
import { setRelations } from "features/relations/relations.slice";
import { setRoles, updateCurrentRole } from "features/roles/roles.slice";
import { setNotification } from "features/uiState/uiState.slice";
import UserData from "features/user/interfaces/user.interface";
import { updateUserData } from "features/user/user.slice";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRelations, getAllRoles, getUserData } from "services/api.service";
import { mainSocketContext } from "src";
import { Store } from "src/app/store";
import { hideById, showById } from "src/components/newGame/utils";
import Dm from "src/shared/interfaces/dm.interface";
import GroupMessage from "src/shared/interfaces/groupMessage.interface";
import UserRelation from "src/shared/interfaces/userRelation";

export default function useWebsockets() {

	/** Global data */
	const { chat, user, relations, roleSlice } = useSelector((store: Store) => store);
	const mainSocket = useContext(mainSocketContext);

	/** Tools */
	const dispatch = useDispatch();

	const serverMessageCallback = (message: Dm) => {
		if (message.relation.id === chat?.currentRelation?.id) {
			dispatch(addMessage(message));
		}
	}

	const serverGroupMessageCallback = (message: GroupMessage) => {

		const relation = relations.blocked.find((relation: UserRelation) =>
			relation.counterPart.id === message.role.user.id
		)
		if (relation) return true;

		if (message.role.chatGroup.id === chat.currentRole?.chatGroup.id) {
			dispatch(addMessage(message));
		}
	}

	const reFetchRelations = async (userId: string) => {
		const { userRelations } = await getAllRelations();
		if (userRelations) {
			dispatch(setRelations(userRelations));
		}
	}

	const reFetchRoles = async (notification: any) => {
		const { userRoles } = await getAllRoles();
		if (userRoles) {
			dispatch(setRoles(userRoles));
		}
		if (notification)
			dispatch(setNotification(notification));
	}

	const displayPlayingRequest = (userRequesting: UserData) => {
		if (user.id !== userRequesting.id) {
			dispatch(setRequestingUser(userRequesting));
			dispatch(showChat(false));
			dispatch(setShowPrivateGameModal(true));
		}
	}

	const updateUserDataCallback = async () => {
		const { userData } = await getUserData();
		if (!userData) return;
		dispatch(updateUserData(userData));
	}

	const userResponseDeclineCallback = async () => {
		dispatch(setRequestingUser(null));
		dispatch(setRequestedUser(""));
		dispatch(setShowPrivateGameModal(false));
		dispatch(setGameIsPrivate(false));
		hideById("pending_game_text");
		showById("start_game_button");
	}

	const chatCloseForUser = (userId: string) => {
		if (userId === user.id) {
			dispatch(closeChat());
		}
	}

	useEffect(() => {
		if (user.login !== "" && mainSocket) {
			mainSocket.on("ServerMessage", serverMessageCallback);
			mainSocket.on("ServerGroupMessage", serverGroupMessageCallback);
			mainSocket.on("UpdateUserRelations", reFetchRelations);
			mainSocket.on("UpdateUserRoles", reFetchRoles);
			mainSocket.on("playingRequest", displayPlayingRequest);
			mainSocket.on("UpdateUserData", updateUserDataCallback);
			mainSocket.on("UserResponseDecline", userResponseDeclineCallback);
			mainSocket.on("closingChat", chatCloseForUser);
			mainSocket.on("updateRoles", reFetchRoles);


			return () => {
				mainSocket.off("ServerMessage", serverMessageCallback);
				mainSocket.off("ServerGroupMessage", serverGroupMessageCallback);
				mainSocket.off("UpdateUserRelations", reFetchRelations);
				mainSocket.off("UpdateUserRoles", reFetchRoles);
				mainSocket.off("playingRequest", displayPlayingRequest);
				mainSocket.off("UpdateUserData", updateUserDataCallback);
				mainSocket.off("closingChat", chatCloseForUser);
			};
		}
	}, [user, chat]);

	useEffect(() => {
		if (user.login !== "" && mainSocket) {
			mainSocket.init(user.id);
		}
	}, [user.login]);
}