import React, { MouseEvent, ReactNode, useState } from "react";
import './Button.scss';

interface Props {
    onClick: (event: MouseEvent<HTMLButtonElement>) => Promise<boolean>;
    id?: string;
    children: ReactNode;
}

export default function Button({ onClick, id = "", children }: Props) {

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
                    <button id={id} className="button" >Loading...</button>
                    :
                    <button id={id} className="button" onClick={handleClick}> {children}</button>
            }
        </>
    )
}