import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import ChatData from '../../../features/chat/interfaces/chat.interface'
import CloseChatOptions from "./closeChatOptions";

export default function ChatOptions(){
	const store: Store = useSelector((store: Store) => store);
	const chatData: ChatData = store.chat;
	
	const dispatch = useDispatch();
	
	return (
		<>
				<div className="chat_options">
					<CloseChatOptions/>
					<p>options here !!!!</p>
				</div>
		</>
	)
}