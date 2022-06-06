import ChatData from '../../features/chat/interfaces/chat.interface'
import { Store } from "../../app/store";
import { useDispatch, useSelector } from "react-redux";
import "./Chat.scss";
import DmPicker from './chatSelector/dmPicker';
import ChatBox from './chatBox/ChatBox';

export default function Chat() {

	/** Global data */
	const store: Store = useSelector((store: Store) => store);
	const chatData: ChatData = store.chat;
	const uiState = store.uiState;

	if (!uiState.showChat) {
		return (
			<></>
		);
	} else {
		return (
			<div id='chat'>
				<DmPicker />
				{/*<ChatBox />*/}
				{/* {chatData.displayOptions && <ChatOptions />} */}
			</div>
		);
	}
}