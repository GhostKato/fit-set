import { useRef, type ChangeEvent } from "react";
import { PRESET_STATIONS } from "../../../../data/radioStations";
import {
  AUDIO_EXTENSIONS_REGEX,
  formatTrackTitle,
} from "../../../../constants/player";
import {
  PlayerSelect,
  type PlayerSelectOption,
} from "../PlayerSelect/PlayerSelect";
import type { LocalTrack, PlayerMode } from "../../../../types/player";
import styles from "./PlayerDrawer.module.css";

interface PlayerDrawerProps {
  mode: PlayerMode;
  onSwitchMode: (nextMode: PlayerMode) => void;
  currentIndex: number;
  onSelectStation: (index: number) => void;
  localTracks: LocalTrack[];
  localIndex: number;
  onSelectLocalTrack: (index: number) => void;
  onLoadLocalTracks: (tracks: LocalTrack[]) => void;
  onError: (message: string) => void;
  isShuffle: boolean;
  onToggleShuffle: () => void;
}

const checkFolderPickerSupport = (): boolean => {
  if (typeof document === "undefined" || typeof navigator === "undefined") {
    return false;
  }
  const input = document.createElement("input");
  const hasWebkitDirectory = "webkitdirectory" in input;
  const isMobileDevice = /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(
    navigator.userAgent,
  );
  return hasWebkitDirectory && !isMobileDevice;
};

const MODE_OPTIONS: PlayerSelectOption[] = [
  { value: "radio", label: "Онлайн радио" },
  { value: "local", label: "Моя музыка" },
];

export const PlayerDrawer = ({
  mode,
  onSwitchMode,
  currentIndex,
  onSelectStation,
  localTracks,
  localIndex,
  onSelectLocalTrack,
  onLoadLocalTracks,
  onError,
  isShuffle,
  onToggleShuffle,
}: PlayerDrawerProps) => {
  const folderInputRef = useRef<HTMLInputElement | null>(null);
  const filesInputRef = useRef<HTMLInputElement | null>(null);
  const canSelectFolder = checkFolderPickerSupport();

  const openSystemPicker = () => {
    if (canSelectFolder) {
      folderInputRef.current?.click();
    } else {
      filesInputRef.current?.click();
    }
  };

  const handleFilesSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const audioFiles = Array.from(fileList)
      .filter(
        (file) =>
          file.type.startsWith("audio/") ||
          AUDIO_EXTENSIONS_REGEX.test(file.name),
      )
      .sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true }),
      );

    e.target.value = "";

    if (audioFiles.length === 0) {
      onError("В выбранном месте не найдено аудиофайлов.");
      return;
    }

    const newTracks: LocalTrack[] = audioFiles.map((file, idx) => ({
      id: `${file.name}-${file.size}-${idx}`,
      title: formatTrackTitle(file.name),
      url: URL.createObjectURL(file),
    }));

    onLoadLocalTracks(newTracks);
  };

  const handleModeChange = (nextValue: string) => {
    if (nextValue === "radio") {
      onSwitchMode("radio");
      onSelectStation(0);
      return;
    }

    if (nextValue === "local") {
      onSwitchMode("local");
    }
  };

  const stationOptions: PlayerSelectOption[] = PRESET_STATIONS.map(
    (station, idx) => ({
      value: String(idx),
      label: `${station.id}. ${station.title}`,
    }),
  );

  const trackOptions: PlayerSelectOption[] = localTracks.map((track, idx) => ({
    value: String(idx),
    label: `${idx + 1}. ${track.title}`,
  }));

  const addButtonText = canSelectFolder ? "Добавить папку" : "Добавить файлы";

  return (
    <div className={styles.drawer}>
      {canSelectFolder && (
        <input
          ref={folderInputRef}
          type="file"
          accept="audio/*"
          multiple
          // @ts-expect-error webkitdirectory поддерживается в браузерах для выбора папок
          webkitdirectory=""
          directory=""
          onChange={handleFilesSelected}
          className={styles.hiddenInput}
        />
      )}

      <input
        ref={filesInputRef}
        type="file"
        accept="audio/*"
        multiple
        onChange={handleFilesSelected}
        className={styles.hiddenInput}
      />

      <div className={styles.controlsRow}>
        <PlayerSelect
          value={mode}
          options={MODE_OPTIONS}
          onChange={handleModeChange}
        />

        {mode === "radio" ? (
          <PlayerSelect
            value={String(currentIndex)}
            options={stationOptions}
            onChange={(val) => onSelectStation(Number(val))}
          />
        ) : localTracks.length === 0 ? (
          <button
            type="button"
            onClick={openSystemPicker}
            className={styles.addBtn}>
            + {addButtonText}
          </button>
        ) : (
          <PlayerSelect
            value={String(localIndex)}
            options={trackOptions}
            onChange={(val) => onSelectLocalTrack(Number(val))}
            topActionLabel={`+ ${addButtonText}`}
            onTopAction={openSystemPicker}
          />
        )}

        {mode === "local" && localTracks.length > 1 && (
          <button
            type="button"
            onClick={onToggleShuffle}
            className={`${styles.shuffleBtn} ${
              isShuffle ? styles.shuffleBtnActive : ""
            }`}>
            {isShuffle ? "Вперемешку" : "По порядку"}
          </button>
        )}
      </div>
    </div>
  );
};
