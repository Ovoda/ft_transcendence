import React from "react";
import DmElement from "./dmElement";
// MUST REMOVE THAT AND RENDER DYNAMICLY

const usersDM = [
	{
		'id': 0,
		'login': 'gpetit',
		'picture': 'https://previews.123rf.com/images/kritchanut/kritchanut1406/kritchanut140600093/29213195-male-silhouette-avatar-profile-picture.jpg'
	},
	{
		'id': 1,
		'login': 'ndemont',
		'picture': 'https://previews.123rf.com/images/kritchanut/kritchanut1406/kritchanut140600093/29213195-male-silhouette-avatar-profile-picture.jpg'
	},
	{
		'id': 2,
		'login': 'calide-n',
		'picture': 'https://previews.123rf.com/images/kritchanut/kritchanut1406/kritchanut140600093/29213195-male-silhouette-avatar-profile-picture.jpg', 
	},
	{
		'id': 3,
		'login': 'nboisde',
		'picture': 'https://previews.123rf.com/images/kritchanut/kritchanut1406/kritchanut140600093/29213195-male-silhouette-avatar-profile-picture.jpg',
	},
];

export default function DmPicker(){
	//const [usrs, setUsrs] = useState(usersDM);
	return (
	<>
		<div>
		{usersDM.map((user)=>{
			//return <DmElement key={user.id} picture={ user.picture } login={ user.login } openChat={} />
			return <DmElement key={user.id} picture={ user.picture } login={ user.login } />
			//return <DmElement {...user}/>
		})}
		</div>
	</>
	);
}