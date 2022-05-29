import React, {useState} from "react";

interface Props {
	login: string
	picture: string
	//openChat: any
}

export default function DmElement(props: Props){
	const [chatBox, setChatBox] = useState(false);
	console.log(props.picture)
	return (
		<>
			{/* <div onClick={()=>{props.openChat()}}> */}
			<div>
				<img src={ props.picture } alt="profile_picture" width="50" height="50" />
				{props.login}
			</div>
		</>
	);
}