import React from "react";
import './ChatButton.scss';

interface Props {
    onClick: React.MouseEventHandler<HTMLButtonElement>;
    text: string;
}

export default function ChatButton({ onClick, text }: Props) {
    return (
        <button onClick={onClick} className="chat_button">{text}</button>
    )
}