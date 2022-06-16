import React, { MouseEvent, ReactNode, useState } from "react";
import './Button.scss';

interface Props {
    onClick: (event: MouseEvent<HTMLButtonElement>) => Promise<boolean> | any;
    id?: string;
    children: ReactNode;
    style?: any;
}

export default function Button({ onClick, id = "", children, style }: Props) {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    function handleClick(event: MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        setIsLoading(true);
        async function load() {
            setIsLoading(await onClick(event));
        }
        load();
    }

    return (
        <>
            {
                isLoading ?
                    <button style={style} id={id} className="button">o</button>
                    :
                    <button style={style} id={id} className="button" onClick={handleClick}> {children}</button>
            }
        </>
    )
}