import React, { Dispatch, SetStateAction } from "react";
import Gameplay from "../interfaces/gameplay.interface";

export interface handleKeysProps {
    event: KeyboardEvent;
    setGameplay: Dispatch<SetStateAction<Gameplay>>
}

export function handleKeyPressed({ event, setGameplay }: handleKeysProps) {
    if (event.key === "ArrowDown") {
        setGameplay((gameplay: Gameplay) => { return { ...gameplay, arrowDown: true } });
    } else if (event.key === "ArrowUp") {
        setGameplay((gameplay: Gameplay) => { return { ...gameplay, arrowUp: true } });
    }
}

export function handleKeyUnpressed({ event, setGameplay }: handleKeysProps) {
    if (event.key === "ArrowDown") {
        setGameplay((gameplay: Gameplay) => { return { ...gameplay, arrowDown: false } });
    } else if (event.key === "ArrowUp") {
        setGameplay((gameplay: Gameplay) => { return { ...gameplay, arrowUp: false } });
    }
}