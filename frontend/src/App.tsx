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
import UserRole from './shared/interfaces/role.interface';
import Notification from './components/notification/notification';

function App() {

  /** Global Data */
  const { uiState, user, relations, roleSlice } = useSelector((store: Store) => store);
  const mainSocket = useContext(mainSocketContext);

  /** Tools */
  const dispatch = useDispatch();

  /** Hooks */
  useFetchSession();
  useWebsockets();

  useEffect(() => {
    if (roleSlice) {
      roleSlice.roles.map((role: UserRole) => {
        mainSocket?.leaveDm(role.chatGroup.id);
        mainSocket?.joinDm(role.chatGroup.id);
      });
    }
  }, [roleSlice.roles]);

  useEffect(() => {
    if (relations) {
      relations.friends.map((relation: UserRelation) => {
        mainSocket?.leaveDm(relation.id);
        mainSocket?.joinDm(relation.id);
      });
    }
  }, [relations.friends]);

  return (
    <div className="App">
      <Notification />
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
