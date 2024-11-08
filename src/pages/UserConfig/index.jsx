import styles from "./UserConfig.module.css";

function UserConfig() {
    return (
        <section className={styles.container}>
            {/* Account Information Section */}
            <div className={styles.accountInfo}>
                <div className={styles.sectionTitle}>Informações da conta:</div>
                <div className={`${styles.card} ${styles.accountCard}`}>
                    <img src="https://via.placeholder.com/100" alt="Profile" className={styles.profileImg} />
                    <div className={styles.accountDetails}>
                        <p className={styles.profileDescription}>
                            Descrição de Perfil: Eu sou o Roberto, um grande fã de fantasia, especialmente de O Hobbit, de J.R.R. Tolkien.
                            Adoro a jornada de Bilbo Bolseiro e como o universo da Terra-média é incrivelmente rico e detalhado.
                            As aventuras e os personagens desse mundo sempre me fascinam e me fazem querer explorar mais sobre esse incrível universo.
                        </p>
                        <p>Nome de usuario: RobertoUFAL</p>
                    </div>
                    <button className={styles.btnEdit}>Editar</button>
                </div>
            </div>

            {/* Private Information Section */}
            <div className={styles.privateInfo}>
                <div className={styles.sectionTitle}>Informações privadas:</div>
                <div className={styles.card}>
                    <table className={styles.infoTable}>
                        <tbody>
                            <tr>
                                <td>Endereço de email:</td>
                                <td>robertodaufal@gmail.com</td>
                            </tr>
                            <tr>
                                <td>Nome:</td>
                                <td>Roberto</td>
                            </tr>
                            <tr>
                                <td>Data de nascimento:</td>
                                <td>23/06/1999</td>
                            </tr>
                            <tr>
                                <td>Senha:</td>
                                <td>********</td>
                            </tr>
                            <tr>
                                <td>Sexo:</td>
                                <td>Masculino</td>
                            </tr>
                            <tr>
                                <td>Local:</td>
                                <td>Brasil, Maceió</td>
                            </tr>
                        </tbody>
                    </table>
                    <p className={styles.privateInfoText}>As outras pessoas não podem ver suas informações, elas são privadas.*</p>
                    <div className={styles.buttonGroup}>
                        <button className={styles.btnUndo}>Desfazer</button>
                        <button className={styles.btnEdit}>Editar</button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default UserConfig;
