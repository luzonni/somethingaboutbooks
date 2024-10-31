import React, { useState, useEffect } from 'react';
import './PomodoroStyle.css';


const Pomodoro = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isRunning && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, time]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  return (
    <div className="container">
      <div className="content">
        <div className="book-info">
          <img src="https://m.media-amazon.com/images/I/819js3EQwbL._AC_UF1000,1000_QL80_.jpg" alt="Book Cover" className="book-cover" />
          <div className="timer">
            <h1>{formatTime(time)}</h1>
            <p>Pág. 67</p>
          </div>
        </div>

        <div className="controls">
          <button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? 'Pausar' : 'Iniciar'}
          </button>
          <button onClick={() => setTime(0)}>Resetar</button>
        </div>

        <div className="progress-bar"> {/* fazer a progress bar com JS dps */}
          <span className="circle completed">1</span>
          <span className="circle completed">2</span>
          <span className="circle completed">3</span>
          <span className="circle active">4</span>
          <span className="circle">5</span>
          <span className="circle">6</span>
          <span className="circle">7</span>
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;