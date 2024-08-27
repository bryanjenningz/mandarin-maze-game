import { useReducer } from "react";
import { initState, reducer } from "../state/reducer";
import { closestMonster } from "../state/utils";
import { PlayerBlock } from "./PlayerBlock";
import { BulletBlock } from "./BulletBlock";
import { MonsterBlock } from "./MonsterBlock";
import { WallBlock } from "./WallBlock";
import { GameStart } from "./GameStart";
import { NewWord } from "./NewWord";
import { LevelReview } from "./LevelReview";
import { useTick } from "../hooks/useTick";
import { useKeyboard } from "../hooks/useKeyboard";
import { useDictionary } from "../hooks/useDictionary";

export const Game = (): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initState);
  useDictionary(dispatch);
  useKeyboard(dispatch);
  useTick(state.monsters, dispatch);

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

        {((): JSX.Element => {
          switch (state.status.type) {
            case "ACTIVE":
            case "PAUSED": {
              return <></>;
            }
            case "SHOWING_NEW_WORD": {
              return (
                <NewWord
                  mandarinWord={state.status.word}
                  resumeGame={() => dispatch({ type: "START_GAME" })}
                />
              );
            }
            case "SHOWING_LEVEL_REVIEW": {
              const firstWord = state.status.words[0];
              if (!firstWord) return <></>;
              return (
                <LevelReview
                  mandarinWord={firstWord}
                  passReview={() => dispatch({ type: "PASS_REVIEW" })}
                  failReview={() => dispatch({ type: "FAIL_REVIEW" })}
                />
              );
            }
          }
        })()}
      </div>
    </div>
  );
};
