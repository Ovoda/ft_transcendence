import { addMessage } from "features/chat/chat.slice";
import { toggleShowFriendRequest } from "features/game/game.slice";
import { setRelations } from "features/relations/relations.slice";
import { setRoles } from "features/roles/roles.slice";
import { setNotification } from "features/uiState/uiState.slice";
import UserData from "features/user/interfaces/user.interface";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllRelations, getAllRoles } from "services/api.service";
import { mainSocketContext } from "src";
import { Store } from "src/app/store";
import Dm from "src/shared/interfaces/dm.interface";
import GroupMessage from "src/shared/interfaces/groupMessage.interface";
import UserRelation from "src/shared/interfaces/userRelation";


export default function useWebsockets() {

	/** Global data */
	const { chat, user, relations } = useSelector((store: Store) => store);
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
		dispatch(toggleShowFriendRequest(userRequesting));
	}

	useEffect(() => {
		if (user.login !== "" && mainSocket) {
			mainSocket.on("ServerMessage", serverMessageCallback);
			mainSocket.on("ServerGroupMessage", serverGroupMessageCallback);
			mainSocket.on("UpdateUserRelations", reFetchRelations);
			mainSocket.on("UpdateUserRoles", reFetchRoles);
			mainSocket.on("playingRequest", displayPlayingRequest);


			return () => {
				mainSocket.off("ServerMessage", serverMessageCallback);
				mainSocket.off("ServerGroupMessage", serverGroupMessageCallback);
				mainSocket.off("UpdateUserRelations", reFetchRelations);
				mainSocket.off("UpdateUserRoles", reFetchRoles);
				mainSocket.off("playingRequest", displayPlayingRequest);
			};
		}

	}, [user, chat]);

	useEffect(() => {
		if (user.login !== "" && mainSocket) {
			mainSocket.init(user.id);
		}
	}, [user.login]);
}