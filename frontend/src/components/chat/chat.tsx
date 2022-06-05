import ChatData from '../../features/chat/interfaces/chat.interface'
import { Store } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import "./Chat.scss";
import ChatBox from './chatBox/chatBox';
import DmPicker from './chatSelector/dmPicker';

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
				<DmPicker />
				{chatData.displayChat && <ChatBox />}
				{/* {chatData.displayOptions && <ChatOptions />} */}
			</div>
		);
	}
}