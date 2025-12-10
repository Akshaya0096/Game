import { Howl, Howler } from "howler";

// Create BGM on demand
export const createBGM = () => {
  return new Howl({
    src: ["/audio/bgm.mp3"],
    loop: true,
    volume: 1.0,
  });
};

// Safe play function
export const playSound = (sound) => {
  if (Howler.ctx.state === "suspended") {
    Howler.ctx.resume().then(() => sound.play());
  } else {
    sound.play();
  }
};
