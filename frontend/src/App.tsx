import 'style/global.scss';
import './App.scss';
import Game from './components/game/game';
import useFetchSession from './hooks/useFetchSession';
import Navbar from './components/navbar';
import UserSettings from './components/user/UserSettings';
import UiState from './features/uiState/interfaces/UiState';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from './app/store';
import { closeSettingWindow } from './features/uiState/uiState.slice';
import TfaRegistration from './components/auth/TfaRegistration';
import { createContext, useEffect } from 'react';
import UserData from './features/user/interfaces/user.interface';
import Chat from './components/chat/chat';
import ClientSocket from './services/websocket.service';
import { addMessage } from './features/chat/chat.slice';
import Message from './shared/interfaces/Message';
import { setFriendConnected, setFriendDisconnected } from 'features/user/user.slice';
import { addRelation, setRelations } from 'features/relations/relations.slice';
import { getRelations } from 'services/api.service';

const mainSocket = new ClientSocket();

export const mainSocketContext = createContext<null | ClientSocket>(null);

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
  // useFriendsStatus();

  useEffect(() => {
    if (userData.login !== "") {
      mainSocket.init(userData.id);
      mainSocket.on("ServerMessage", (message: Message) => {
        dispatch(addMessage(message));
      });
      mainSocket?.on("FriendConnection", async (userId: string) => {
        const userRelations = await getRelations();
        if (userRelations.data) {
          dispatch(setRelations(userRelations.data));
        }
      });
      mainSocket?.on("FriendDisconnection", async (userId: string) => {
        const userRelations = await getRelations();
        if (userRelations.data) {
          dispatch(setRelations(userRelations.data));
        }
      });
      mainSocket?.on("NewFriend", (data: any) => {
        dispatch(addRelation(data));
      });
    }
  }, [userData.login]);

  useEffect(() => {
    if (chat.currentRoom !== "") {
      mainSocket.joinRoom(chat.currentRoom);
    }
  }, [chat.currentRoom]);

  useEffect(() => {
    if (chat.currentRelation) {
      mainSocket.joinRoom(chat.currentRelation.id);
    }
  }, [chat.currentRelation]);

  return (
    <div className="App">
      <mainSocketContext.Provider value={mainSocket}>
        <Navbar />
        <TfaRegistration />
        <Chat />
        <UserSettings
          settingsWindowState={uiState.openedSettings}
          setSettingsWindowAction={() => dispatch(closeSettingWindow())} />
        <header className="App-header">
          {userData.login !== "" && <Game />}
        </header>
      </mainSocketContext.Provider>
    </div >
  );
}

export default App;
