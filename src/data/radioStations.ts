import type { Station } from "../types/player";

const NIGHTRIDE_HOST = "https://stream.nightride.fm";

export const PRESET_STATIONS: Station[] = [
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
