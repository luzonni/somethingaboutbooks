import React, { useState, useEffect } from 'react';
import styles from "./Pomodoro.module.css"


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
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.bookInfo}>
          <img src="https://m.media-amazon.com/images/I/819js3EQwbL._AC_UF1000,1000_QL80_.jpg" alt="Book Cover" className={styles.bookCover} />
          <div className={styles.timer}>
            <h1>{formatTime(time)}</h1>
            <p>Pág. 67</p>
          </div>
        </div>

        <div className={styles.controls}>
          <button onClick={() => setIsRunning(!isRunning)}>
            {isRunning ? 'Pausar' : 'Iniciar'}
          </button>
          <button onClick={() => setTime(0)}>Resetar</button>
        </div>

        <div className={styles.progressBar}> {/* fazer a progress bar com JS dps */}
          <span className={styles.circle}>1</span>
          <span className={styles.circle}>2</span>
          <span className={styles.circle}>3</span>
          <span className={styles.circle}>4</span>
          <span className={styles.circle}>5</span>
          <span className={styles.circle}>6</span>
          <span className={styles.circle}>7</span>
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;