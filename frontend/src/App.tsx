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
import { closeSettingWindow, updateUiState } from './features/uiState/uiState.slice';
import TfaRegistration from './components/auth/TfaRegistration';
import TfaLogin from './components/auth/TfaLogin';

function App() {

  /** Tools */
  const dispatch = useDispatch();

  /** Global Data */
  const uiState: UiState = useSelector((store: Store) => store.uiState);

  /** Hooks */
  useFetchSession();

  return (
    <div className="App">
      <Navbar />
      <TfaRegistration />
      <TfaLogin />
      <UserSettings
        settingsWindowState={uiState.openedSettings}
        setSettingsWindowAction={() => dispatch(closeSettingWindow())} />
      <header className="App-header">
        <Game></Game>
      </header>
    </div >
  );
}

export default App;
