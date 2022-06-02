import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import { updateDisplayOptions } from "../../../features/chat/chat.slice";
import ChatData from '../../../features/chat/interfaces/chat.interface'


export default function OpenChatOptions(){
	const store: Store = useSelector((store: Store) => store);
	const chatData: ChatData = store.chat;
	
	const dispatch = useDispatch();
	
	return (
		<>
				<div>
					<button onClick={()=>dispatch(updateDisplayOptions(true))}>options</button>
				</div>
		</>
	)
}