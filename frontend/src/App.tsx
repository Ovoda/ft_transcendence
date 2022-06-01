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
import { closeChat, closeSettingWindow, updateUiState } from './features/uiState/uiState.slice';
import TfaRegistration from './components/auth/TfaRegistration';
import TfaLogin from './components/auth/TfaLogin';
import Chat from './components/chat/chat';

function App() {

  /** Tools */

  /** Global Data */
    const store: Store = useSelector((store: Store) => store);
    const userData = store.user;
    const uiState = store.uiState;

    /** Tools */
    const dispatch = useDispatch();

  /** Hooks */
  useFetchSession();

  return (
    <div className="App">
      <Navbar />
      <TfaRegistration />
      <TfaLogin />
	  <Chat />
      <UserSettings
        settingsWindowState={uiState.openedSettings}
        setSettingsWindowAction={() => dispatch(closeSettingWindow())} />
      <header className="App-header">
		{ userData.login !== "" && <Game /> }
      </header>
    </div >
  );
}

export default App;
