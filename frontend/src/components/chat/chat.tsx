import { Store } from "../../app/store";
import { useSelector } from "react-redux";
import "./chat.scss";
import DmPicker from './chatSelector/dmPicker';
import ChatBox from './chatBox/ChatBox';

export default function Chat() {

	/** Global data */
	const { uiState, chat }: Store = useSelector((store: Store) => store);

	if (!uiState.showChat) {
		return (
			<></>
		);
	} else {
		return (
			<div id='chat'>
				<DmPicker />
				{chat.displayChatBox && <ChatBox />}
			</div>
		);
	}
}