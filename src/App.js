import './App.css';
import DogList from './Components/DogList.tsx';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h3>Dogs</h3>  
      </header>
      <div class='lg-12'>
        <DogList/>
      </div>
    </div>
  );
}

export default App;
