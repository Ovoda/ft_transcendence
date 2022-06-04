import ChatData from '../../features/chat/interfaces/chat.interface'
import { Store } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import ChatSelector from "./chatSelector/chatSelector";
import ChatBox from './chatBox/ChatBox';
import "./Chat.scss";
import ChatOptions from './chatOptions/chatOptions';

export default function Chat() {
	// GLOBAL DATA.
	const store: Store = useSelector((store: Store) => store);
	const chatData: ChatData = store.chat;
	const uiState = store.uiState;

	// Tools
	const dispatch = useDispatch();

	if (!uiState.showChat) {
		return (
			<></>
		);
	} else {
		return (
			<div id='chat'>
				<ChatSelector />
				{chatData.displayChat && <ChatBox />}
				{/* {chatData.displayOptions && <ChatOptions />} */}
			</div>
		);
	}
}