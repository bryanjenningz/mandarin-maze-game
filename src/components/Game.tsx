import { useEffect, useReducer } from "react";
import { initState, reducer } from "../state/reducer";
import { closestMonster } from "../state/utils";
import { PlayerBlock } from "./PlayerBlock";
import { BulletBlock } from "./BulletBlock";
import { MonsterBlock } from "./MonsterBlock";
import { WallBlock } from "./WallBlock";
import { loadDictionary } from "../dictionary/loadDictionary";
import { parseDictionary } from "../dictionary/parseDictionary";
import { GameStart } from "./GameStart";
import { generateMonsterMoves } from "../state/random";
import { NewWord } from "./NewWord";

export const Game = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initState);

  useEffect(() => {
    void (async () => {
      const dictionaryText = await loadDictionary();
      const mandarinDictionary = parseDictionary(dictionaryText);
      dispatch({ type: "SET_MANDARIN_DICTIONARY", mandarinDictionary });
    })();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      dispatch({ type: "KEY_DOWN", key: e.key });
    };
    const onKeyUp = (e: KeyboardEvent) => {
      dispatch({ type: "KEY_UP", key: e.key });
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    let unmounted = false;
    const update = () => {
      if (unmounted) return;
      dispatch({
        type: "TICK",
        time: Date.now(),
        monsterMoves: generateMonsterMoves(state.monsters),
      });
      requestAnimationFrame(update);
    };
    update();
    return () => {
      unmounted = true;
    };
  }, []);

  if (state.status.type === "START") {
    return <GameStart dispatch={dispatch} state={state} />;
  }

  const closest = closestMonster(state.player, state.monsters);

  return (
    <div className="text-white bg-black w-full h-[100svh] flex justify-center items-center">
      <div className="relative aspect-square w-full max-w-2xl bg-gray-800">
        {state.walls.map((wall, i) => {
          return <WallBlock key={i} wall={wall} />;
        })}

        {state.monsters.length > 0 &&
          state.exits.map((exit, i) => {
            return <WallBlock key={i} wall={exit} />;
          })}

        {state.monsters.map((monster, i) => {
          return <MonsterBlock key={i} monster={monster} closest={closest} />;
        })}

        {state.monsterBullets.map((bullet, i) => {
          return <BulletBlock key={i} bullet={bullet} />;
        })}

        {state.bullets.map((bullet, i) => {
          return <BulletBlock key={i} bullet={bullet} />;
        })}

        <PlayerBlock player={state.player} />

        {state.status.type === "SHOWING_NEW_WORD" && (
          <NewWord
            mandarinWord={state.status.word}
            resumeGame={() => dispatch({ type: "START_GAME" })}
          />
        )}
      </div>
    </div>
  );
};
