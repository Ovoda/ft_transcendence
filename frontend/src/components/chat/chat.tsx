import { Store } from "../../app/store";
import { useSelector } from "react-redux";
import "./chat.scss";
import DmPicker from './chatSelector/dmPicker';
import ChatBox from "./chatBox/chatBox";
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