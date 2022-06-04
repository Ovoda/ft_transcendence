import 'style/global.scss';
import './App.scss';
import Game from './components/game/game';
import useFetchSession from './hooks/useFetchSession';
import Navbar from './components/navbar';
import "style/button.scss";
import { api } from './services/api.service';
import UserSettings from './components/user/UserSettings';
import UiState from './features/uiState/interfaces/UiState';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from './app/store';
import { closeSettingWindow } from './features/uiState/uiState.slice';
import TfaRegistration from './components/auth/TfaRegistration';
import TfaLogin from './components/auth/TfaLogin';
import { createContext, useEffect } from 'react';
import UserData from './features/user/interfaces/user.interface';
import Chat from './components/chat/chat';
import ClientSocket from './services/websocket';
import { addMessage } from './features/chat/chat.slice';
import Message from './shared/interfaces/Message';

const mainSocket = new ClientSocket();

export const socketContext = createContext<null | ClientSocket>(null);

function App() {

  /** Global Data */
  const store: Store = useSelector((store: Store) => store);
  const uiState: UiState = store.uiState;
  const userData: UserData = store.user;
  const chat = store.chat;

  /** Tools */
  const dispatch = useDispatch();

  /** Hooks */
  useFetchSession();

  useEffect(() => {
    if (userData.login !== "") {
      mainSocket.initSocket(userData.id);
      mainSocket.on("ServerMessage", (message: Message) => {
        dispatch(addMessage(message));
      });
    }
  }, [userData]);

  useEffect(() => {
    mainSocket.joinRoom(chat.currentRoom);
  }, [chat.currentRoom]);

  return (
    <div className="App">
      <socketContext.Provider value={mainSocket}>
        <Navbar />
        <TfaRegistration />
        <Chat />
        <UserSettings
          settingsWindowState={uiState.openedSettings}
          setSettingsWindowAction={() => dispatch(closeSettingWindow())} />
        <header className="App-header">
          {userData.login !== "" && <Game />}
          <Game />
        </header>
      </socketContext.Provider>
    </div >
  );
}

export default App;
