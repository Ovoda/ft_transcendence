import { Dispatch, SetStateAction, useEffect } from 'react';
import './SwitchButton.scss';

interface Props {
    value: boolean;
    setValue: Dispatch<SetStateAction<boolean>>
}

export default function SwitchButton({ value, setValue }: Props) {

    return (
        <label className="switch_button">
            <input checked={value} onChange={() => setValue((value) => !value)} type="checkbox" />
            <span className="switch_button_slider"></span>
        </label>
    )
}