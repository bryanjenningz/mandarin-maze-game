const gameMap = [
  "#EEEE###############",
  "#    #             #",
  "#    #             #",
  "#    #             #",
  "#    #    ####     #",
  "#                  #",
  "#             #    #",
  "######        #    #",
  "#                  #",
  "#       ####       #",
  "#                  #",
  "#                  #",
  "#            #     #",
  "######       #     #",
  "#    #       #     #",
  "#    #       #     #",
  "#    #             #",
  "#                  #",
  "#                  #",
  "####################",
].map((row) => row.split(""));

export const Game = () => {
  return (
    <div className="h-[100svh] flex justify-center items-center">
      <div className="aspect-square bg-slate-800 w-full max-w-2xl flex flex-col">
        {gameMap.map((row, y) => {
          return (
            <div key={y} className="flex h-[5%]">
              {row.map((box, x) => {
                return (
                  <div
                    key={x}
                    className={
                      "w-full " +
                      ((): string => {
                        switch (box) {
                          case "#":
                            return "bg-blue-800";
                          case " ":
                          case "E":
                            return "bg-black";
                          default:
                            return "";
                        }
                      })()
                    }
                  ></div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
