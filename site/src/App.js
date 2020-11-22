import './App.css';
import Carousel from './Carousel';
import vid from './video.mp4'

function App() {

  return (
    <div className="App">
      <Carousel />
      <video autoPlay muted loop id="myVideo"
        style={{position:'fixed', right:0, bottom:0, minWidth:'100%', minHeight:'100%', zIndex:-1}}>
        <source src={vid}
      type='video/mp4'/></video>
    </div>
  );
}

export default App;
