"use client";

export default function Home() {
  const handleLocalGameClick = () => {
    location.href = "/localgame";
  };

  const handleRandomPlayerClick = () => {
    location.href = "/randomplayer";
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-slate-300">
      <div className="flex flex-col items-center gap-24 -mt-6">
        <div className="text-4xl">Tic Tac Toe</div>
        <div className="text-xl">Select Game Mode</div>
      </div>
      <div className="flex gap-8 mt-8">
        <div
          onClick={handleLocalGameClick}
          className="cursor-pointer    hover:text-slate-500"
        >
          Local Game
        </div>
        <div
          onClick={handleRandomPlayerClick}
          className="cursor-pointer hover:text-slate-500"
        >
          Select Random Player
        </div>
      </div>
    </div>
  );
}
