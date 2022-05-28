import axios from "axios";

export default function HomePage() {

    const login = () => {
        window.location.href = `http://localhost:3001/login/user`;
    };

    return (
        <button onClick={login}>login</button>
    );
}