import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaForward, FaPause, FaPlay, FaUndo } from 'react-icons/fa';
import BookCover from '../../components/BookCover';
import ProgressBar from '../../components/ProgressBar';
import { InputCheckBox } from '../../components/Inputs';
import { useLibrary } from '../../context/LibraryContext';
import { usePomodoro } from '../../context/PomodoroContext';
import { useToast } from '../../context/ToastContext';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useShortcut } from '../../hooks/useShortcut';
import { readingStreak } from '../../utils/readingStats';
import { readingProgress, sessionsOnDay, sumMinutes } from '../../services/library';
import { MODES, canNotify, cycleProgress, formatTime, sanitizeMinutes } from '../../utils/pomodoro';
import styles from './Pomodoro.module.css';

const RADIUS = 90;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const TimerRing = ({ timer }) => {
  const progress = timer.duration ? timer.remaining / timer.duration : 0;
  return (
    <div className={styles.ring}>
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <circle className={styles.ringTrack} cx="100" cy="100" r={RADIUS} />
        <circle
          className={timer.mode === 'focus' ? styles.ringFocus : styles.ringBreak}
          cx="100"
          cy="100"
          r={RADIUS}
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
        />
      </svg>
      <div className={styles.timer}>
        <h1 role="timer" aria-label={`Tempo restante: ${formatTime(timer.remaining)}`}>{formatTime(timer.remaining)}</h1>
        <p>{MODES[timer.mode]}</p>
      </div>
    </div>
  );
};

const CycleDots = () => {
  const { timer, settings } = usePomodoro();
  const { total, done } = cycleProgress(timer, settings);
  return (
    <div className={styles.progressBar} role="img" aria-label={`${done} de ${total} focos concluídos neste ciclo`}>
      {Array.from({ length: total }, (_, index) => {
        const isCurrent = index === done && timer.mode === 'focus';
        const state = index < done ? styles.completed : isCurrent ? styles.active : '';
        return <span key={index} className={`${styles.circle} ${state}`}>{index + 1}</span>;
      })}
    </div>
  );
};

const BookPanel = () => {
  const { canSave, entries, getEntry, sessions, setProgress, setTotalPages } = useLibrary();
  const { timer, setBook } = usePomodoro();

  if (!canSave) {
    return (
      <section className={styles.panel}>
        <h2>Livro da sessão</h2>
        <p className={styles.muted}>
          <Link to="/login" state={{ from: '/pomodoro' }}>Entre</Link> para vincular a sessão a um livro e guardar seu tempo de leitura.
        </p>
      </section>
    );
  }

  const options = entries.filter((entry) => entry.shelf === 'reading' || entry.shelf === 'want');
  const selected = getEntry(timer.bookId);
  const bookMinutes = sumMinutes(sessions.filter((session) => session.bookId === timer.bookId));

  return (
    <section className={styles.panel}>
      <h2>Livro da sessão</h2>
      {options.length === 0 && !selected ? (
        <p className={styles.muted}>
          Adicione um livro em <Link to="/books">Lendo ou Quero ler</Link> para escolher aqui.
        </p>
      ) : (
        <>
          <label className={styles.field}>
            <span>Escolha um livro</span>
            <select value={selected ? timer.bookId : ''} onChange={(event) => setBook(event.target.value)}>
              <option value="">Sem livro</option>
              {selected && !options.includes(selected) && <option value={selected.id}>{selected.title}</option>}
              {options.map((entry) => (
                <option key={entry.id} value={entry.id}>{entry.title}</option>
              ))}
            </select>
          </label>
          {selected && (
            <div className={styles.bookInfo}>
              <Link to={`/books/${selected.id}`} className={styles.bookCover} aria-label={selected.title}>
                <BookCover src={selected.cover} title={selected.title} />
              </Link>
              <div>
                <strong>{selected.title}</strong>
                <p className={styles.muted}>{selected.author}</p>
                <p className={styles.muted}>{bookMinutes} min de foco neste livro</p>
                <div className={styles.pages}>
                  <label className={styles.field}>
                    <span>Página atual</span>
                    <input
                      type="number"
                      min="0"
                      value={selected.currentPage ?? ''}
                      onChange={(event) => setProgress(selected.id, event.target.value)}
                    />
                  </label>
                  <label className={styles.field}>
                    <span>Total</span>
                    <input
                      type="number"
                      min="1"
                      placeholder={selected.pages ? String(selected.pages) : '—'}
                      value={selected.totalPages ?? ''}
                      onChange={(event) => setTotalPages(selected.id, selected.currentPage, event.target.value)}
                    />
                  </label>
                </div>
                {readingProgress(selected) !== null && (
                  <ProgressBar value={readingProgress(selected)} label={`Progresso em ${selected.title}`} />
                )}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

const MINUTE_FIELDS = [
  ['focus', 'Foco'],
  ['short', 'Pausa curta'],
  ['long', 'Pausa longa'],
  ['longEvery', 'Focos até a pausa longa'],
];

const SettingsPanel = () => {
  const { settings, updateSettings } = usePomodoro();
  const { notify } = useToast();
  return (
    <details className={styles.panel}>
      <summary>Configurações</summary>
      <div className={styles.settings}>
        {MINUTE_FIELDS.map(([name, label]) => (
          <label key={name} className={styles.field}>
            <span>{label}</span>
            <input
              key={settings[name]}
              type="number"
              min="1"
              max={name === 'longEvery' ? 12 : 180}
              defaultValue={settings[name]}
              onBlur={(event) => {
                const value = sanitizeMinutes(event.target.value, settings[name]);
                event.target.value = value;
                updateSettings({ [name]: name === 'longEvery' ? Math.min(value, 12) : value });
              }}
            />
          </label>
        ))}
      </div>
      <InputCheckBox
        label="Iniciar a próxima etapa automaticamente"
        checked={settings.autoStart}
        onChange={(event) => updateSettings({ autoStart: event.target.checked })}
      />
      <InputCheckBox
        label="Tocar um som ao terminar"
        checked={settings.sound}
        onChange={(event) => updateSettings({ sound: event.target.checked })}
      />
      {canNotify() && (
        <InputCheckBox
          label="Notificar quando estiver em outra aba"
          checked={settings.notify}
          onChange={async (event) => {
            const wanted = event.target.checked;
            if (!wanted) return updateSettings({ notify: false });
            const permission = Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission;
            updateSettings({ notify: permission === 'granted' });
            if (permission !== 'granted') notify('Permita as notificações do site no navegador para usar este recurso.', { tone: 'error' });
          }}
        />
      )}
    </details>
  );
};

const Pomodoro = () => {
  const { sessions, canSave } = useLibrary();
  const { timer, start, pause, reset, skip, setMode, setBook } = usePomodoro();
  const [searchParams, setSearchParams] = useSearchParams();
  const bookFromUrl = searchParams.get('livro');

  useDocumentTitle('Pomodoro');

  useEffect(() => {
    if (!bookFromUrl) return;
    setBook(bookFromUrl);
    setSearchParams({}, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookFromUrl]);

  const today = sessionsOnDay(sessions);
  const isRunning = timer.status === 'running';
  const streak = readingStreak(sessions);

  useShortcut(' ', () => (isRunning ? pause() : start()));
  useShortcut(['r', 'R'], reset);
  useShortcut(['p', 'P'], skip);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.modes} role="group" aria-label="Etapa">
          {Object.entries(MODES).map(([mode, label]) => (
            <button
              key={mode}
              type="button"
              aria-pressed={timer.mode === mode}
              className={timer.mode === mode ? styles.modeActive : styles.mode}
              onClick={() => setMode(mode)}
            >
              {label}
            </button>
          ))}
        </div>

        <TimerRing timer={timer} />

        <div className={styles.controls}>
          <button type="button" className={styles.primary} onClick={isRunning ? pause : start}>
            {isRunning ? <FaPause aria-hidden="true" /> : <FaPlay aria-hidden="true" />}
            {isRunning ? 'Pausar' : timer.status === 'paused' ? 'Continuar' : 'Iniciar'}
          </button>
          <button type="button" className={styles.secondary} onClick={reset}>
            <FaUndo aria-hidden="true" /> Reiniciar
          </button>
          <button type="button" className={styles.secondary} onClick={skip}>
            <FaForward aria-hidden="true" /> Pular
          </button>
        </div>

        <CycleDots />

        {canSave && (
          <p className={styles.muted}>
            Hoje: {today.length} {today.length === 1 ? 'sessão' : 'sessões'} · {sumMinutes(today)} min de foco
            {streak > 1 && ` · ${streak} dias seguidos`}
          </p>
        )}

        <p className={styles.shortcuts} aria-hidden="true">
          <kbd>Espaço</kbd> iniciar/pausar · <kbd>R</kbd> reiniciar · <kbd>P</kbd> pular
        </p>
      </div>

      <div className={styles.sidebar}>
        <BookPanel />
        <SettingsPanel />
      </div>
    </div>
  );
};

export default Pomodoro;
