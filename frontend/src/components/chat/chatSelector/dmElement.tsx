import ChatData, { e_roomtype } from '../../../features/chat/interfaces/chat.interface';
import React, {useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import { updateDisplayChat } from '../../../features/chat/chat.slice';

interface Props {
	login: string
	picture: string
	//openChat: any
}

export default function DmElement(props: Props){
	console.log(props.picture)
	const store: Store = useSelector((store: Store) => store);
	const chatData: ChatData = store.chat;
	
	const dispatch = useDispatch();

	return (
		<>
			{/* <div onClick={()=>{props.openChat()}}> */}
			<div onClick={()=> dispatch(updateDisplayChat(true))}>
				<img src={ props.picture } alt="profile_picture" width="50" height="50" />
				{props.login}
			</div>
		</>
	);
}