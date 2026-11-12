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
  {
    id: 1,
    title: "Datawave FM",
    genre: "Cyberpunk / Gym",
    url: `${NIGHTRIDE_HOST}/datawave.mp3`,
  },
  {
    id: 2,
    title: "Chillsynth FM",
    genre: "Synth / Focus",
    url: `${NIGHTRIDE_HOST}/chillsynth.mp3`,
  },
  {
    id: 3,
    title: "EBSM Radio",
    genre: "Dark / Industrial",
    url: `${NIGHTRIDE_HOST}/ebsm.mp3`,
  },
  {
    id: 4,
    title: "Horrorsynth",
    genre: "Heavy Synth",
    url: `${NIGHTRIDE_HOST}/horrorsynth.mp3`,
  },
  {
    id: 5,
    title: "Nightride FM",
    genre: "Synthwave / Phonk",
    url: `${NIGHTRIDE_HOST}/nightride.mp3`,
  },
];

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
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

  const handleRandom = () => {
    let randomIndex = Math.floor(Math.random() * PRESET_STATIONS.length);
    if (randomIndex === currentIndex && PRESET_STATIONS.length > 1) {
      randomIndex = (randomIndex + 1) % PRESET_STATIONS.length;
    }
    setCurrentIndex(randomIndex);
    setIsPlaying(true);
  };

  return (
    <div className={styles.player}>
      <audio
        ref={audioRef}
        src={currentStation.url}
        preload="none"
        onError={() => {
          setIsPlaying(false);
          setErrorMsg("Станция временно недоступна. Переключите волну.");
        }}
      />

      <div className={styles.container}>
        <div className={styles.topBar}>
          <div className={styles.stationInfo}>
            <span className={styles.stationMeta}>
              РАДИО #{currentStation.id} • {currentStation.genre}
            </span>
            <div className={styles.stationTitle}>{currentStation.title}</div>
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
              className={`${styles.controlBtn} ${styles.playBtn}`}>
              {isPlaying ? "Пауза" : "Играть"}
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
              onClick={handleRandom}
              className={styles.controlBtn}
              title="Случайная станция">
              🎲
            </button>
            <button
              type="button"
              onClick={() => setIsMinimized((prev) => !prev)}
              className={`${styles.controlBtn} ${styles.toggleBtn}`}>
              {isMinimized ? "Список" : "Скрыть"}
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
  );
};
