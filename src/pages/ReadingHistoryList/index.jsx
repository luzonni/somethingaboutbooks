import React from 'react';
import styles from './ReadingHistoryList.module.css';

const ReadingHistoryList = () => {
    const readings = [
        'J.R.R Tolkien - O Silmarillion',
        'J.R.R Tolkien - Beren e Lúthien',
        'J.R.R Tolkien - Os Filhos de Húrin',
        'J.R.R Tolkien - A Queda de Gondolin',
        'J.R.R Tolkien - Contos Inacabados de Númenor e da Terra-Média',
        'J.R.R Tolkien - A Queda de Númenor',
        'J.R.R Tolkien - O Hobbit',
        'J.R.R Tolkien - O Senhor dos Anéis: A Sociedade do Anel',
        'J.R.R Tolkien - O Senhor dos Anéis: As Duas Torres',
        'J.R.R Tolkien - O Senhor dos Anéis: O Retorno do Rei'
    ];

    return (
        <div className={`container ${styles.pageContainer}`}>
            <div className={`d-flex justify-content-between align-items-center ${styles.header}`}>
                <h1 className={styles.title}>Histórico - Leituras</h1>
                <span className={styles.userIcon}>RobertoUFAL</span>
            </div>
            <div className={styles.readingList}>
                <h3 className={styles.subtitle}>Minhas leituras:</h3>
                <ul className={`list-group ${styles.listGroup}`}>
                    {readings.map((book, index) => (
                        <li key={index} className={`list-group-item ${styles.listItem}`}>
                            {book}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ReadingHistoryList;
