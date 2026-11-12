import { useState, useRef, useEffect, type CSSProperties } from "react";

interface Station {
  id: number;
  title: string;
  genre: string;
  url: string;
}

const NIGHTRIDE_HOST = "https://stream.nightride.fm";
const SOMAFM_HOST = "https://ice5.somafm.com";

const PRESET_STATIONS: Station[] = [
  {
    id: 1,
    title: "Nightride FM",
    genre: "Synthwave / Phonk",
    url: `${NIGHTRIDE_HOST}/nightride.mp3`,
  },
  {
    id: 2,
    title: "Chillsynth FM",
    genre: "Synth / Focus",
    url: `${NIGHTRIDE_HOST}/chillsynth.mp3`,
  },
  {
    id: 3,
    title: "Datawave FM",
    genre: "Cyberpunk / Gym",
    url: `${NIGHTRIDE_HOST}/datawave.mp3`,
  },
  {
    id: 4,
    title: "EBSM Radio",
    genre: "Dark / Industrial",
    url: `${NIGHTRIDE_HOST}/ebsm.mp3`,
  },
  {
    id: 5,
    title: "Horrorsynth",
    genre: "Heavy Synth",
    url: `${NIGHTRIDE_HOST}/horrorsynth.mp3`,
  },
];

export const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
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
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#1e1e1e",
        color: "#fff",
        padding: "12px 16px",
        borderTop: "2px solid #28a745",
        zIndex: 1000,
      }}>
      <audio
        ref={audioRef}
        src={currentStation.url}
        preload="none"
        onError={() => {
          setIsPlaying(false);
          setErrorMsg("Станция временно недоступна. Переключите волну.");
        }}
      />

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}>
          <div>
            <span
              style={{
                fontSize: "12px",
                color: "#28a745",
                fontWeight: "bold",
              }}>
              РАДИО #{currentStation.id} • {currentStation.genre}
            </span>
            <div style={{ fontSize: "15px", fontWeight: "bold" }}>
              {currentStation.title}
            </div>
            {errorMsg && (
              <div
                style={{
                  fontSize: "12px",
                  color: "#ff6b6b",
                  marginTop: "2px",
                }}>
                {errorMsg}
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <button
              type="button"
              onClick={handlePrev}
              style={btnStyle}
              title="Предыдущая">
              ⏮
            </button>
            <button
              type="button"
              onClick={togglePlay}
              style={{
                ...btnStyle,
                backgroundColor: "#28a745",
                padding: "8px 16px",
                fontWeight: "bold",
              }}>
              {isPlaying ? "Пауза" : "Играть"}
            </button>
            <button
              type="button"
              onClick={handleNext}
              style={btnStyle}
              title="Следующая">
              ⏭
            </button>
            <button
              type="button"
              onClick={handleRandom}
              style={btnStyle}
              title="Случайная станция">
              🎲
            </button>
            <button
              type="button"
              onClick={() => setIsMinimized((prev) => !prev)}
              style={{
                ...btnStyle,
                border: "1px solid #555",
                backgroundColor: "transparent",
              }}>
              {isMinimized ? "Список" : "Скрыть"}
            </button>
          </div>
        </div>

        {!isMinimized && (
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              marginTop: "12px",
              paddingTop: "10px",
              borderTop: "1px solid #333",
            }}>
            {PRESET_STATIONS.map((station, idx) => (
              <button
                key={station.id}
                type="button"
                onClick={() => {
                  setCurrentIndex(idx);
                  setIsPlaying(true);
                }}
                style={{
                  padding: "5px 10px",
                  fontSize: "12px",
                  borderRadius: "14px",
                  border:
                    idx === currentIndex
                      ? "1px solid #28a745"
                      : "1px solid #444",
                  backgroundColor: idx === currentIndex ? "#28a745" : "#2a2a2a",
                  color: "#fff",
                  cursor: "pointer",
                }}>
                {station.id}. {station.title}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const btnStyle: CSSProperties = {
  padding: "8px 12px",
  backgroundColor: "#333",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontSize: "14px",
};
