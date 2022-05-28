import 'style/global.scss';
import './App.scss';
import Game from './components/game/game';
import useFetchSession from './hooks/useFetchSession';
import Navbar from './components/navbar';
import "style/button.scss";

function App() {

  useFetchSession();

  return (
    <div className="App">
      <Navbar />
      <header className="App-header">
        <Game></Game>
      </header>
    </div >
  );
}

export default App;
