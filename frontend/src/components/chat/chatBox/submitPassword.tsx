import React from "react";

export default function SubmitPassword(){
	return (
		<>
			<div>
				<input type="text" id="submit_password" className="chat_input" placeholder="chat password" />
				<button id="password_button" className="chat_button">Submit Password</button>
			</div>
		</>
	);
}