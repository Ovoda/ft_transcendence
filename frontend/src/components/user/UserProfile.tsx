import { useSelector } from "react-redux";
import { Store } from "../../app/store";
import UserData from "../../features/user/interfaces/user.interface";

export default function UserDataProfile() {

    /** Global data */

    const userData: UserData = useSelector((store: Store) => store.user);

    if (userData.login !== "") {
        return (
            <>
                <p>{userData.login}</p>
                <img src={userData.avatar} alt={userData.login + "'s avatar"} />
            </>
        )
    }
    return (
        <></>
    );
}