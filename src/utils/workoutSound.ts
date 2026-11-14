export type WorkoutSignalType =
  | "prepare"
  | "workStart"
  | "setDone"
  | "exerciseDone"
  | "workoutDone";

const createToneWavDataUrl = (
  notes: { start: number; end: number; freq: number }[],
  duration: number,
): string => {
  const sampleRate = 22050;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = new ArrayBuffer(44 + numSamples * 2);
  const view = new DataView(buffer);

  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  writeString(0, "RIFF");
  view.setUint32(4, 36 + numSamples * 2, true);
  writeString(8, "WAVE");
  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(36, "data");
  view.setUint32(40, numSamples * 2, true);

  const normFactor = Math.tanh(2.5);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    for (const note of notes) {
      if (t >= note.start && t <= note.end) {
        const localT = t - note.start;
        const noteLen = note.end - note.start;
        const envelope = Math.min(1, localT * 60) * (1 - localT / noteLen);
        const rawWave = Math.sin(2 * Math.PI * note.freq * t);
        sample = (Math.tanh(rawWave * 2.5) / normFactor) * envelope;
        break;
      }
    }

    const intSample = Math.max(-1, Math.min(1, sample)) * 32767;
    view.setInt16(44 + i * 2, intSample, true);
  }

  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return `data:audio/wav;base64,${btoa(binary)}`;
};

const SOUND_MAP: Record<WorkoutSignalType, string> = {
  prepare: createToneWavDataUrl(
    [
      { start: 0, end: 0.09, freq: 660 },
      { start: 0.14, end: 0.23, freq: 660 },
      { start: 0.28, end: 0.37, freq: 660 },
    ],
    0.4,
  ),
  workStart: createToneWavDataUrl(
    [
      { start: 0, end: 0.11, freq: 880 },
      { start: 0.14, end: 0.36, freq: 1320 },
    ],
    0.4,
  ),
  setDone: createToneWavDataUrl(
    [
      { start: 0, end: 0.16, freq: 880 },
      { start: 0.2, end: 0.44, freq: 660 },
    ],
    0.48,
  ),
  exerciseDone: createToneWavDataUrl(
    [
      { start: 0, end: 0.12, freq: 660 },
      { start: 0.15, end: 0.27, freq: 880 },
      { start: 0.3, end: 0.55, freq: 1175 },
    ],
    0.58,
  ),
  workoutDone: createToneWavDataUrl(
    [
      { start: 0, end: 0.12, freq: 587 },
      { start: 0.14, end: 0.26, freq: 740 },
      { start: 0.28, end: 0.4, freq: 880 },
      { start: 0.43, end: 0.85, freq: 1175 },
    ],
    0.9,
  ),
};

let sharedAudioCtx: AudioContext | null = null;

export const playWorkoutSignal = (type: WorkoutSignalType) => {
  try {
    const audio = new Audio(SOUND_MAP[type]);
    audio.volume = 1;

    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;

    if (AudioCtx) {
      if (!sharedAudioCtx) {
        sharedAudioCtx = new AudioCtx();
      }
      if (sharedAudioCtx.state === "suspended") {
        sharedAudioCtx.resume().catch(() => {});
      }
      const source = sharedAudioCtx.createMediaElementSource(audio);
      const gainNode = sharedAudioCtx.createGain();
      gainNode.gain.value = 5.5;
      source.connect(gainNode);
      gainNode.connect(sharedAudioCtx.destination);
    }

    audio.play().catch(() => {});
  } catch {
    // Игнорируем блокировку автовоспроизведения, если она возникла
  }
};
