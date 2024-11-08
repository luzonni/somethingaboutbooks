import React from 'react';
import styles from './PreConfigs.module.css';

const App = () => {
  return (
    <div className={styles.appContainer}>
      {/*  Perfil */}
      <div className={styles.profileSection}>
        <div className={styles.profileCard}>
          <div className={styles.avatar}></div>
          <h2>Olá, Roberto!</h2>
        </div>
      </div>

      {/* Fncionalidades */}
      <div className={styles.featureSection}>
        <div className={styles.featureCard}>
          <img src="https://www.shutterstock.com/image-vector/id-card-icon-driver-license-600nw-1658307391.jpg" alt="Informações da Conta" className={styles.featureImage} />
          <h3>Informações da Conta</h3>
          <p>Acesse as informações da sua conta e altere-as</p>
        </div>
        <div className={styles.featureCard}>
          <img src="https://static.thenounproject.com/png/1197627-200.png" alt="Histórico" className={styles.featureImage} />
          <h3>Histórico</h3>
          <p>Acesse o seu histórico</p>
        </div>
      </div>
    </div>
  );
};

export default App;
