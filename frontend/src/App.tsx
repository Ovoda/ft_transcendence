import './App.css';
import 'style/global.scss';
import './App.css';
import Game from './components/game/game';
import HomePage from './pages/HomePage/HomePage';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <HomePage />
        {/* <Game></Game> */}
      </header>
    </div>
  );
}

export default App;
