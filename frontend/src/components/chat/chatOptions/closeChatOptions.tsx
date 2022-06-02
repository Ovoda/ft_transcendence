import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import ChatData from '../../../features/chat/interfaces/chat.interface'
import { updateDisplayOptions } from "../../../features/chat/chat.slice";

export default function CloseChatOptions(){
	const store: Store = useSelector((store: Store) => store);
	const chatData: ChatData = store.chat;
	
	const dispatch = useDispatch();
	
	return (
		<>
			<div>
				<button onClick={()=>dispatch(updateDisplayOptions(false))}>Close</button>
			</div>
		</>
	)
}