import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Store } from "src/app/store";
import { openChatDms, setCurrentRoom } from "../../../features/chat/chat.slice";
import './dmPicker.scss';
// MUST REMOVE THAT AND RENDER DYNAMICLY

const usersDM = [
	{
		'id': "0",
		'login': 'gpetit',
		'picture': 'https://previews.123rf.com/images/kritchanut/kritchanut1406/kritchanut140600093/29213195-male-silhouette-avatar-profile-picture.jpg'
	},
	{
		'id': "1",
		'login': 'ndemont',
		'picture': 'https://previews.123rf.com/images/kritchanut/kritchanut1406/kritchanut140600093/29213195-male-silhouette-avatar-profile-picture.jpg'
	},
	{
		'id': "2",
		'login': 'calide-n',
		'picture': 'https://previews.123rf.com/images/kritchanut/kritchanut1406/kritchanut140600093/29213195-male-silhouette-avatar-profile-picture.jpg',
	},
	{
		'id': "3",
		'login': 'nboisde',
		'picture': 'https://previews.123rf.com/images/kritchanut/kritchanut1406/kritchanut140600093/29213195-male-silhouette-avatar-profile-picture.jpg',
	},
];

export default function DmPicker() {

	/** Global Data */
	const chat = useSelector((store: Store) => store.chat);

	/** Tools */
	const dispatch = useDispatch();

	function selectDmRoom(id: string) {
		dispatch(openChatDms());
		dispatch(setCurrentRoom(id));
	}

	if (chat.displayChatSelector) {
		return (
			<div id="dm_picker">
				{
					usersDM.map((user) =>
						<div key={user.id} onClick={() => selectDmRoom(user.id)} className="chat_friend">
							<img src={user.picture} alt="profile_picture" width="50" height="50" />
							{user.login}
						</div>
					)}

			</div>
		);
	}
	return (<></>);
}