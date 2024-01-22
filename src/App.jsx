import "./App.css";
import Quiz from "./components/Header/Quiz";
import backgroundImage from "../src/bg.png"; 

function App() {
  return (
    <div
      style={{
        background: `url(${backgroundImage}) center/cover no-repeat fixed`,
        height: '100vh', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Quiz />
    </div>
  );
}

export default App;
