import 'style/global.scss';
import './App.scss';
import Game from './components/game/game';
import useFetchSession from './hooks/useFetchSession';
import Navbar from './components/navbar';
import UserSettings from './components/user/UserSettings';
import { useDispatch, useSelector } from 'react-redux';
import { Store } from './app/store';
import { closeSettingWindow } from './features/uiState/uiState.slice';
import TfaRegistration from './components/auth/TfaRegistration';
import { useContext, useEffect } from 'react';
import Chat from './components/chat/chat';
import useWebsockets from './hooks/useWebsocket';
import { mainSocketContext } from 'src';
import UserRelation from './shared/interfaces/userRelation';

function App() {

  /** Global Data */
  const { uiState, user, chat, relations } = useSelector((store: Store) => store);
  const mainSocket = useContext(mainSocketContext);

  /** Tools */
  const dispatch = useDispatch();

  /** Hooks */
  useFetchSession();
  useWebsockets();

  useEffect(() => {
    if (chat.currentRoom !== "") {
      mainSocket?.joinRoom(chat.currentRoom);
    }
  }, [chat.currentRoom]);

  useEffect(() => {
    if (relations) {
      relations.relations.map((relation: UserRelation) => {
        mainSocket?.leaveDm(relation.id);
        mainSocket?.joinDm(relation.id);
      });
    }
  }, [relations.relations]);

  return (
    <div className="App">
      <Navbar />
      <TfaRegistration />
      <Chat />
      <UserSettings
        settingsWindowState={uiState.openedSettings}
        setSettingsWindowAction={() => dispatch(closeSettingWindow())} />
      <header className="App-header">
        {user.login !== "" && <Game />}
      </header>
    </div >
  );
}

export default App;
