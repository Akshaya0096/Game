import React, { useEffect, useState } from 'react';
import { Howl, Howler } from 'howler';

const GameSounds = () => {
  const [bgm, setBgm] = useState(null);
  const [clickSound, setClickSound] = useState(null);
  const [gameStartSound, setGameStartSound] = useState(null);
  const [winSound, setWinSound] = useState(null);
  const [loseSound, setLoseSound] = useState(null);

  useEffect(() => {
    
    setBgm(new Howl({ src: ['/audio/bgm.mp3'], loop: true, volume: 0.5 }));
    setClickSound(new Howl({ src: ['/audio/click.wav'], volume: 1.0 }));
    setGameStartSound(new Howl({ src: ['/audio/game_start.mp3'], volume: 1.0 }));
    setWinSound(new Howl({ src: ['/audio/win.mp3'], volume: 1.0 }));
    setLoseSound(new Howl({ src: ['/audio/lose.mp3'], volume: 1.0 }));
  }, []);


  const resumeAudioContext = () => {
    if (Howler.ctx.state === 'suspended') {
      Howler.ctx.resume();
    }
  };

  const handleStartGame = () => {
    resumeAudioContext();
    bgm?.play();
    gameStartSound?.play();
  };

  const handleClick = () => {
    resumeAudioContext();
    clickSound?.play();
  };

  const handleWin = () => {
    resumeAudioContext();
    winSound?.play();
  };

  const handleLose = () => {
    resumeAudioContext();
    loseSound?.play();
  };

  return (
    <div>
      <button onClick={handleStartGame}>Start Game</button>
      <button onClick={handleClick}>Click</button>
      <button onClick={handleWin}>Win</button>
      <button onClick={handleLose}>Lose</button>
    </div>
  );
};

export default GameSounds;
