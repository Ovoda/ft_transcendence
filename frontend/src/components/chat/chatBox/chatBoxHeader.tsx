import Button from "assets/Button/Button";
import { RoleTypeEnum } from "enums/roleType.enum";
import { UserActivityStatusEnum } from "enums/userConnectionStatus.enum";
import { useContext, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { mainSocketContext } from "src";
import { Store } from "src/app/store";
import settings_image from 'images/settings.png';
import { deleteGroup, leaveGroup } from "services/group.api.service";
import './chatBoxHeader.scss';
import { closeChatSettings, openChatSettings, showChat } from "features/chat/chat.slice";
import { hideById, showById } from "src/components/game/utils";
import { setRequestedUser } from "features/game/game.slice";

export default function ChatBoxHeader() {

	/** Global data */
	const { chat, user } = useSelector((store: Store) => store);
	const mainSocket = useContext(mainSocketContext);

	/** Variables */
	const [currentCounterPartId, setCurrentCounterPartId] = useState<string>("");

	/** Tools */
	const dispatch = useDispatch();

	/** Functions */
	function handleOpenSettings() {
		if (chat.openGroupSettings === "") {
			dispatch(openChatSettings());
		} else {
			dispatch(closeChatSettings());
		}
	}

	async function handleWatchRequest() {
		mainSocket?.watchingRequest({ watched: currentCounterPartId, watcher: user.id, });
		dispatch(showChat(false));
		return false;
	}

	async function handlePlayRequest() {
		dispatch(showChat(false));
		hideById("start_game_button");
		showById("pending_game_text");
		showById("pending_game_button");

		dispatch(setRequestedUser(chat.currentRelation?.counterPart.id));
		mainSocket?.emit("playingRequest", {
			userRequesting: user.id,
			userRequested: chat.currentRelation?.counterPart.id,
		});
		return false;
	}

	async function handleLeaveGroup() {
		if (!chat.currentRole) return false;
		mainSocket?.closingChat(user.id);
		await leaveGroup(chat.currentRole?.chatGroup.id, chat.currentRole.id);
		mainSocket?.reloadRoles(user.id);
		return false;
	}

	async function handleDeleteGroup() {
		if (!chat.currentRole) return false;
		await deleteGroup(chat.currentRole?.chatGroup.id, chat.currentRole.id);
		mainSocket?.reloadRoles(user.id);
		return false;
	}

	/** Effects */
	useEffect(() => {
		if (chat.currentRelation) {
			setCurrentCounterPartId(chat.currentRelation.counterPart.id);
		}
	}, [chat.currentRelation]);

	/** TSX */
	if (chat.currentRelation) {
		return (
			<div className={"chat_box_header"}>
				<p className="chat_box_header_title">{chat.currentRelation?.counterPart.username}</p>
				{
					chat.currentRelation?.counterPart.activityStatus === UserActivityStatusEnum.PLAYING &&
					<Button onClick={handleWatchRequest}>Watch</Button>
				}
				{
					chat.currentRelation?.counterPart.activityStatus === UserActivityStatusEnum.CONNECTED &&
					<Button onClick={handlePlayRequest}>Play</Button>
				}
			</div>
		)
	}

	if (chat.currentRole) {
		return (
			<div className={"chat_box_header"}>
				<p className="chat_box_header_title">{chat.currentRole.chatGroup.name}</p>
				{
					chat.currentRole?.role !== RoleTypeEnum.OWNER &&
					<Button id="leave_group_button" onClick={handleLeaveGroup}>Leave</Button>
				}
				{
					(chat.currentRole?.role === RoleTypeEnum.OWNER) &&
					<>
						<Button id="delete_group_button" onClick={handleDeleteGroup}>Delete</Button>
					</>
				}
				{
					(chat.currentRole?.role === RoleTypeEnum.OWNER
						|| chat.currentRole?.role === RoleTypeEnum.ADMIN) &&
					<>
						<img onClick={handleOpenSettings} src={settings_image} alt="" />
					</>
				}
			</div>
		);
	}
	return (<></>);
}