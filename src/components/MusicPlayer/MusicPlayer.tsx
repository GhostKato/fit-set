import { useState, useRef, useEffect } from "react";
import styles from "./MusicPlayer.module.css";

interface Station {
  id: number;
  title: string;
  genre: string;
  url: string;
}

const NIGHTRIDE_HOST = "https://stream.nightride.fm";

const PRESET_STATIONS: Station[] = [
  // --- Киберпанк, Синтвейв и Бейс ---
  {
    id: 1,
    title: "Datawave FM",
    genre: "Cyberpunk / Gym",
    url: `${NIGHTRIDE_HOST}/datawave.mp3`,
  },
  {
    id: 2,
    title: "Darksynth FM",
    genre: "Aggressive Synth",
    url: `${NIGHTRIDE_HOST}/darksynth.mp3`,
  },
  {
    id: 3,
    title: "Nightride FM",
    genre: "Synthwave / Phonk",
    url: `${NIGHTRIDE_HOST}/nightride.mp3`,
  },
  {
    id: 4,
    title: "Rekt FM",
    genre: "Drum & Bass / Breakbeat",
    url: `${NIGHTRIDE_HOST}/rekt.mp3`,
  },
  {
    id: 5,
    title: "EBSM Radio",
    genre: "Dark / Industrial",
    url: `${NIGHTRIDE_HOST}/ebsm.mp3`,
  },
  {
    id: 6,
    title: "Horrorsynth",
    genre: "Heavy Synth",
    url: `${NIGHTRIDE_HOST}/horrorsynth.mp3`,
  },
  {
    id: 7,
    title: "Spacesynth FM",
    genre: "Space / Cardio",
    url: `${NIGHTRIDE_HOST}/spacesynth.mp3`,
  },
  {
    id: 8,
    title: "Chillsynth FM",
    genre: "Synth / Stretching",
    url: `${NIGHTRIDE_HOST}/chillsynth.mp3`,
  },
];

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const currentStation = PRESET_STATIONS[currentIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setErrorMsg("");
    if (isPlaying) {
      audio.load();
      audio.play().catch(() => {
        setIsPlaying(false);
        setErrorMsg("Не удалось запустить поток. Попробуйте другую станцию.");
      });
    } else {
      audio.pause();
    }
  }, [currentIndex, isPlaying]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % PRESET_STATIONS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + PRESET_STATIONS.length) % PRESET_STATIONS.length,
    );
    setIsPlaying(true);
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={currentStation.url}
        preload="none"
        onError={() => {
          setIsPlaying(false);
          setErrorMsg("Станция временно недоступна. Переключите волну.");
        }}
      />

      {isCollapsed ? (
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className={`${styles.floatingEqBtn} ${
            isPlaying ? styles.floatingEqBtnPlaying : ""
          }`}
          title={`Развернуть плеер (${currentStation.title})`}
          aria-label="Развернуть плеер">
          <div
            className={`${styles.equalizer} ${
              isPlaying ? styles.equalizerPlaying : ""
            }`}
            aria-hidden="true">
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </div>
          <span className={styles.floatingTitle}>{currentStation.title}</span>
        </button>
      ) : (
        <div className={styles.player}>
          <div className={styles.container}>
            <div className={styles.topBar}>
              <div className={styles.stationInfo}>
                <span className={styles.stationMeta}>
                  РАДИО #{currentStation.id} • {currentStation.genre}
                </span>
                <div className={styles.titleRow}>
                  <div
                    className={`${styles.equalizer} ${
                      isPlaying ? styles.equalizerPlaying : ""
                    }`}
                    aria-hidden="true">
                    <span className={styles.bar} />
                    <span className={styles.bar} />
                    <span className={styles.bar} />
                    <span className={styles.bar} />
                  </div>
                  <div className={styles.stationTitle}>
                    {currentStation.title}
                  </div>
                </div>
                {errorMsg && <div className={styles.errorMsg}>{errorMsg}</div>}
              </div>

              <div className={styles.controls}>
                <button
                  type="button"
                  onClick={handlePrev}
                  className={styles.controlBtn}
                  title="Предыдущая">
                  ⏮
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  className={`${styles.controlBtn} ${styles.playBtn} ${
                    isPlaying ? styles.playBtnActive : ""
                  }`}
                  title={isPlaying ? "Пауза" : "Играть"}>
                  {isPlaying ? "⏸" : "▶"}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={styles.controlBtn}
                  title="Следующая">
                  ⏭
                </button>

                <button
                  type="button"
                  onClick={() => setIsMinimized((prev) => !prev)}
                  className={`${styles.controlBtn} ${styles.toggleBtn}`}
                  title="Список станций">
                  {isMinimized ? "☰" : "✕"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsCollapsed(true)}
                  className={`${styles.controlBtn} ${styles.minimizeBtn}`}
                  title="Свернуть плеер вправо">
                  ▶
                </button>
              </div>
            </div>

            {!isMinimized && (
              <div className={styles.stationsList}>
                {PRESET_STATIONS.map((station, idx) => (
                  <button
                    key={station.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setIsPlaying(true);
                    }}
                    className={`${styles.stationChip} ${
                      idx === currentIndex ? styles.stationChipActive : ""
                    }`}>
                    {station.id}. {station.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
