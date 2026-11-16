import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type MouseEvent,
} from "react";
import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  PictureInPicture2,
} from "lucide-react";
import { PRESET_STATIONS } from "../../data/radioStations";
import { PlayerDrawer } from "./components/PlayerDrawer/PlayerDrawer";
import { useLanguage } from "../../context/LanguageContext";
import type { LocalTrack, PlayerMode } from "../../types/player";
import styles from "./MusicPlayer.module.css";

export const MusicPlayer = () => {
  const { t } = useLanguage();
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
      : (currentLocalTrack?.title ?? t.playerNoTracks);

  const activeMeta =
    mode === "radio"
      ? `${t.playerRadioLabel} #${currentStation.id} • ${currentStation.genre}`
      : localTracks.length > 0
        ? `${t.playerMyMusicLabel} • ${localIndex + 1} ${t.playerOfLabel} ${localTracks.length}`
        : `${t.playerMyMusicLabel} • ${t.playerSelectTracksHint}`;

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
        setErrorMsg(t.playerErrorStream);
      });
    } else {
      radioAudio.pause();
    }
  }, [mode, currentIndex, isPlaying, t.playerErrorStream]);

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
        setErrorMsg(t.playerErrorLocalFile);
      });
    } else {
      localAudio.pause();
    }
  }, [mode, localIndex, currentLocalTrack, isPlaying, t.playerErrorLocalFile]);

  const togglePlay = () => {
    if (mode === "local" && localTracks.length === 0) {
      setIsMinimized(false);
      setErrorMsg(t.playerErrorSelectFirst);
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
      artist:
        mode === "radio"
          ? currentStation.genre
          : `Fit Set • ${t.playerModeLocal}`,
      album: "Fit Set Player",
    });

    navigator.mediaSession.setActionHandler("play", () => setIsPlaying(true));
    navigator.mediaSession.setActionHandler("pause", () => setIsPlaying(false));
    navigator.mediaSession.setActionHandler("previoustrack", handlePrev);
    navigator.mediaSession.setActionHandler("nexttrack", handleNext);
  }, [
    activeTitle,
    mode,
    currentStation.genre,
    handlePrev,
    handleNext,
    t.playerModeLocal,
  ]);

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
          setErrorMsg(t.playerErrorStationUnavailable);
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
          setErrorMsg(t.playerErrorReadFile);
        }}
      />

      {isCollapsed ? (
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className={`${styles.floatingEqBtn} ${
            isPlaying ? styles.floatingEqBtnPlaying : ""
          }`}
          title={`${t.playerExpandTitle} (${activeTitle})`}
          aria-label={t.playerExpandTitle}>
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
              title={isMinimized ? t.playerOpenDrawerTitle : undefined}>
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
                  title={t.playerPrevTitle}>
                  <SkipBack size={18} />
                </button>
                <button
                  type="button"
                  onClick={togglePlay}
                  className={`${styles.controlBtn} ${styles.playBtn} ${
                    isPlaying ? styles.playBtnActive : ""
                  }`}
                  title={isPlaying ? t.playerPauseTitle : t.playerPlayTitle}>
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className={styles.controlBtn}
                  title={t.playerNextTitle}>
                  <SkipForward size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsMinimized(true);
                    setIsCollapsed(true);
                  }}
                  className={`${styles.controlBtn} ${styles.minimizeBtn}`}
                  title={t.playerCollapseTitle}>
                  <PictureInPicture2 size={18} />
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
