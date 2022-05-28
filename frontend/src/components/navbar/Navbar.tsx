import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Store } from "src/app/store";
import UserData from "src/features/user/interfaces/user.interface";
import LoggedInMenu from "./LoggedInMenu";
import LoggedOutMenu from "./LoggedOutMenu";
import './Navbar.scss';

export default function Navbar() {

    /** Global Data */
    const userData: UserData = useSelector((store: Store) => store.user);

    useEffect(() => {
        console.log(userData);
    }, [userData])

    return (
        <nav id="navbar">
            {
                userData.login === "" ? <LoggedOutMenu /> : <LoggedInMenu userData={userData} />
            }
        </nav>
    )
}