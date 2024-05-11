"use client";

export default function Home() {
  const handleLocalGameClick = () => {
    location.href = "/localgame";
  };

  const handleRandomPlayerClick = () => {
    location.href = "/randomplayer";
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-slate-400">
      <div className="flex flex-col items-center gap-12 -mt-6">
        <div className=" text-6xl">Tic Tac Toe</div>
        <div className="text-3xl">Select Game Mode</div>
      </div>
      <div className="flex items-center justify-center gap-8 mt-8">
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
