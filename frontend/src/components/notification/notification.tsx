
import { setNotification } from 'features/uiState/uiState.slice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from 'src/app/store';
import './notification.scss';
import close from 'images/close_white.png';

export default function Notification() {

    /** Global data */
    const { uiState } = useSelector((store: Store) => store);

    /** Tools */
    const dispatch = useDispatch();

    if (uiState.notification !== "") {
        return (
            <div id="notification_container">
                <div id="notification">
                    <img onClick={() => dispatch(setNotification(""))} src={close} alt="" />
                    <p>{uiState.notification}</p>
                </div>
            </div>
        )
    }
    return <></>;
} 