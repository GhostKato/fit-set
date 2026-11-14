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

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let sample = 0;

    for (const note of notes) {
      if (t >= note.start && t <= note.end) {
        const localT = t - note.start;
        const noteLen = note.end - note.start;
        const envelope = Math.min(1, localT * 40) * (1 - localT / noteLen);
        sample = Math.sin(2 * Math.PI * note.freq * t) * envelope * 0.85;
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

const SET_DONE_URL = createToneWavDataUrl(
  [
    { start: 0, end: 0.14, freq: 880 },
    { start: 0.18, end: 0.42, freq: 1175 },
  ],
  0.45,
);

const REST_DONE_URL = createToneWavDataUrl(
  [
    { start: 0, end: 0.15, freq: 880 },
    { start: 0.22, end: 0.37, freq: 880 },
    { start: 0.44, end: 0.8, freq: 1175 },
  ],
  0.85,
);

export const playWorkoutSignal = (type: "setDone" | "restDone") => {
  try {
    const audio = new Audio(type === "setDone" ? SET_DONE_URL : REST_DONE_URL);
    audio.volume = 1;
    audio.play().catch(() => {});
  } catch {
    // Игнорируем блокировку автовоспроизведения, если она возникла
  }
};
