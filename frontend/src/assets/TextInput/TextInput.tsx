import React, { ChangeEvent, Dispatch, SetStateAction } from "react";
import './TextInput.scss';

interface Props {
    text: string;
    setText: Dispatch<SetStateAction<string>>;
    type?: string;
    name?: string;
    id?: string;
    placeholder?: string;
}

/**
 * TextInput is a simple utils component made for text input.
 * It take a value and a setter obtainable from useState<string>();
 * TextInput handles the input changes and the display of the input element.
 * It comes with its own css file and properties.
 * 
 * @param props.text - value of the input text
 * @param props.setText - setter of props.text
 * @param props.type - input's type
 * @param props.name - input's name
 * @param props.id - input's dom ID
 * @param props.placeholder - input's placeholder
 * @returns an input element of type text
 */
export default function TextInput({ text, setText, type = "text", name = "", id = "", placeholder = "" }: Props) {

    function textOnChange(event: ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        setText(event.target.value);
    }


    return (
        <div id={id} className="reskue_text_input_container">
            <input name={name} type={type} value={text} onChange={textOnChange} />
            <label className="placeholder_text" htmlFor={name} >
                <p>{placeholder}</p>
            </label>
        </div>
    );
}