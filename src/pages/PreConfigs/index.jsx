import { Link } from 'react-router-dom';
import { FaHistory, FaIdCard, FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import styles from './PreConfigs.module.css';

const PreConfigs = () => {
  const { user } = useAuth();

  useDocumentTitle('Minha conta');

  return (
    <div className={styles.appContainer}>
      <h1 className={styles.greeting}>Olá, {user.username}!</h1>

      <div className={styles.featureSection}>
        <Link className={styles.featureCard} to={`/user/${user.username}`}>
          <FaUserCircle className={styles.featureIcon} aria-hidden="true" />
          <h2>Meu perfil</h2>
          <p>Veja suas estatísticas, favoritos e reviews</p>
        </Link>
        <Link className={styles.featureCard} to="/userconfig">
          <FaIdCard className={styles.featureIcon} aria-hidden="true" />
          <h2>Informações da conta</h2>
          <p>Acesse as informações da sua conta e altere-as</p>
        </Link>
        <Link className={styles.featureCard} to="/readinghistorylist">
          <FaHistory className={styles.featureIcon} aria-hidden="true" />
          <h2>Histórico</h2>
          <p>Acesse suas estantes, listas e tempo de leitura</p>
        </Link>
      </div>
    </div>
  );
};

export default PreConfigs;
