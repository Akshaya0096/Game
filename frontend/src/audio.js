import { Howl, Howler } from "howler";


export const createBGM = () => {
  return new Howl({
    src: ["/audio/bgm.mp3"],
    loop: true,
    volume: 1.0,
  });
};


export const playSound = (sound) => {
  if (Howler.ctx.state === "suspended") {
    Howler.ctx.resume().then(() => sound.play());
  } else {
    sound.play();
  }
};
