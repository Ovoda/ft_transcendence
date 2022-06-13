import { Store } from "../../app/store";
import { useSelector } from "react-redux";
import "./Chat.scss";
import DmPicker from './chatSelector/dmPicker';
import ChatBox from "./chatBox/ChatBox";
export default function Chat() {

	/** Global data */
	const { chat, user }: Store = useSelector((store: Store) => store);

	if (user.login === "") return <></>;

	return (
		<div id='chat'>
			<DmPicker />
			{chat.displayChatBox && <ChatBox />}
		</div>
	);
}