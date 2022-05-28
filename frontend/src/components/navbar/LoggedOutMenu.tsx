import { login } from "../../services/auth.service";

export default function LoggedOutMenu() {

    return (
        <div id="navbar_logged_out">
            <button onClick={login}>Log in</button>
        </div>
    );
}