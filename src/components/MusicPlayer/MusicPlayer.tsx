import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type MouseEvent,
} from "react";
import { PRESET_STATIONS } from "../../data/radioStations";
import { PlayerDrawer } from "./components/PlayerDrawer/PlayerDrawer";
import type { LocalTrack, PlayerMode } from "../../types/player";
import styles from "./MusicPlayer.module.css";

export const MusicPlayer = () => {
  const playerRef = useRef<HTMLDivElement | null>(null);
  const radioAudioRef = useRef<HTMLAudioElement | null>(null);
  const localAudioRef = useRef<HTMLAudioElement | null>(null);

  const [mode, setMode] = useState<PlayerMode>("radio");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [localTracks, setLocalTracks] = useState<LocalTrack[]>([]);
  const [localIndex, setLocalIndex] = useState<number>(0);
  const [isShuffle, setIsShuffle] = useState<boolean>(false);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(true);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const currentStation = PRESET_STATIONS[currentIndex];
  const currentLocalTrack = localTracks[localIndex] ?? null;

  const activeTitle =
    mode === "radio"
      ? currentStation.title
      : (currentLocalTrack?.title ?? "Треки не выбраны");

  const activeMeta =
    mode === "radio"
      ? `РАДИО #${currentStation.id} • ${currentStation.genre}`
      : localTracks.length > 0
        ? `МОЯ МУЗЫКА • ${localIndex + 1} из ${localTracks.length}`
        : "МОЯ МУЗЫКА • ВЫБЕРИТЕ ТРЕКИ";

  useEffect(() => {
    if (isMinimized || isCollapsed) return;

    const handleClickOutside = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (playerRef.current && target && !playerRef.current.contains(target)) {
        setIsMinimized(true);
      }
    };

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isMinimized, isCollapsed]);

  useEffect(() => {
    return () => {
      localTracks.forEach((track) => URL.revokeObjectURL(track.url));
    };
  }, [localTracks]);

  useEffect(() => {
    const radioAudio = radioAudioRef.current;
    const localAudio = localAudioRef.current;
    if (!radioAudio) return;

    if (mode !== "radio") {
      radioAudio.pause();
      return;
    }

    localAudio?.pause();
    setErrorMsg("");

    if (isPlaying) {
      radioAudio.load();
      radioAudio.play().catch(() => {
        setIsPlaying(false);
        setErrorMsg("Не удалось запустить поток. Попробуйте другую станцию.");
      });
    } else {
      radioAudio.pause();
    }
  }, [mode, currentIndex, isPlaying]);

  useEffect(() => {
    const localAudio = localAudioRef.current;
    const radioAudio = radioAudioRef.current;
    if (!localAudio) return;

    if (mode !== "local") {
      localAudio.pause();
      return;
    }

    radioAudio?.pause();
    setErrorMsg("");

    if (!currentLocalTrack) {
      localAudio.pause();
      setIsPlaying(false);
      return;
    }

    if (isPlaying) {
      localAudio.load();
      localAudio.play().catch(() => {
        setIsPlaying(false);
        setErrorMsg("Не удалось воспроизвести этот аудиофайл.");
      });
    } else {
      localAudio.pause();
    }
  }, [mode, localIndex, currentLocalTrack, isPlaying]);
  const togglePlay = () => {
    if (mode === "local" && localTracks.length === 0) {
      setIsMinimized(false);
      setErrorMsg("Сначала выберите папку или аудиофайлы.");
      return;
    }
    setIsPlaying((prev) => !prev);
  };

  const handleNext = useCallback(() => {
    if (mode === "radio") {
      setCurrentIndex((prev) => (prev + 1) % PRESET_STATIONS.length);
      setIsPlaying(true);
      return;
    }

    if (localTracks.length === 0) return;

    setLocalIndex((prev) => {
      if (isShuffle && localTracks.length > 1) {
        let next = prev;
        while (next === prev) {
          next = Math.floor(Math.random() * localTracks.length);
        }
        return next;
      }
      return (prev + 1) % localTracks.length;
    });
    setIsPlaying(true);
  }, [mode, localTracks.length, isShuffle]);

  const handlePrev = useCallback(() => {
    if (mode === "radio") {
      setCurrentIndex(
        (prev) => (prev - 1 + PRESET_STATIONS.length) % PRESET_STATIONS.length,
      );
      setIsPlaying(true);
      return;
    }

    if (localTracks.length === 0) return;

    setLocalIndex(
      (prev) => (prev - 1 + localTracks.length) % localTracks.length,
    );
    setIsPlaying(true);
  }, [mode, localTracks.length]);

  useEffect(() => {
    if (!("mediaSession" in navigator)) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: activeTitle,
      artist: mode === "radio" ? currentStation.genre : "Fit Set • Моя музыка",
      album: "Fit Set Player",
    });

    navigator.mediaSession.setActionHandler("play", () => setIsPlaying(true));
    navigator.mediaSession.setActionHandler("pause", () => setIsPlaying(false));
    navigator.mediaSession.setActionHandler("previoustrack", handlePrev);
    navigator.mediaSession.setActionHandler("nexttrack", handleNext);
  }, [activeTitle, mode, currentStation.genre, handlePrev, handleNext]);

  const handleLoadLocalTracks = (newTracks: LocalTrack[]) => {
    localTracks.forEach((track) => URL.revokeObjectURL(track.url));
    setLocalTracks(newTracks);
    setLocalIndex(0);
    setMode("local");
    setErrorMsg("");
    setIsPlaying(true);
  };

  const handleSwitchMode = (nextMode: PlayerMode) => {
    if (nextMode === mode) return;
    setErrorMsg("");
    setMode(nextMode);
    if (nextMode === "local" && localTracks.length === 0) {
      setIsPlaying(false);
    }
  };

  const handleTopBarClick = (event: MouseEvent<HTMLDivElement>) => {
    if (!isMinimized) return;
    const target = event.target as HTMLElement;
    if (target.closest("button")) return;
    setIsMinimized(false);
  };
  return (
    <>
      <audio
        ref={radioAudioRef}
        src={currentStation.url}
        preload="none"
        onError={() => {
          if (mode !== "radio") return;
          setIsPlaying(false);
          setErrorMsg("Станция временно недоступна. Переключите волну.");
        }}
      />

      <audio
        ref={localAudioRef}
        src={currentLocalTrack?.url}
        preload="none"
        onEnded={handleNext}
        onError={() => {
          if (mode !== "local" || !currentLocalTrack) return;
          setIsPlaying(false);
          setErrorMsg("Ошибка чтения файла.");
        }}
      />

      {isCollapsed ? (
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className={`${styles.floatingEqBtn} ${
            isPlaying ? styles.floatingEqBtnPlaying : ""
          }`}
          title={`Развернуть плеер (${activeTitle})`}
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
          <span className={styles.floatingTitle}>{activeTitle}</span>
        </button>
      ) : (
        <div ref={playerRef} className={styles.player}>
          <div className={styles.container}>
            <div
              onClick={handleTopBarClick}
              className={`${styles.topBar} ${
                isMinimized ? styles.topBarExpandable : ""
              }`}
              title={
                isMinimized
                  ? "Нажмите, чтобы открыть список станций и треков"
                  : undefined
              }>
              <div className={styles.stationInfo}>
                <span className={styles.stationMeta}>{activeMeta}</span>
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
                  <div className={styles.stationTitle}>{activeTitle}</div>
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
                  onClick={() => {
                    setIsMinimized(true);
                    setIsCollapsed(true);
                  }}
                  className={`${styles.controlBtn} ${styles.minimizeBtn}`}
                  title="Свернуть плеер вправо">
                  ▶
                </button>
              </div>
            </div>

            {!isMinimized && (
              <PlayerDrawer
                mode={mode}
                onSwitchMode={handleSwitchMode}
                currentIndex={currentIndex}
                onSelectStation={(idx) => {
                  setCurrentIndex(idx);
                  setIsPlaying(true);
                }}
                localTracks={localTracks}
                localIndex={localIndex}
                onSelectLocalTrack={(idx) => {
                  setLocalIndex(idx);
                  setIsPlaying(true);
                }}
                onLoadLocalTracks={handleLoadLocalTracks}
                onError={(msg) => setErrorMsg(msg)}
                isShuffle={isShuffle}
                onToggleShuffle={() => setIsShuffle((prev) => !prev)}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};
