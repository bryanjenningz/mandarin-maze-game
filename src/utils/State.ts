import type { Action, Bullet, Monster, Player } from "../components/game";
import { updateBullets } from "./bullet";
import * as GameMap from "./game-map";
import { updateMonsters } from "./monster";
import { initPlayer, updatePlayer } from "./player";
import * as Walls from "./walls";

export type State = {
  keysDown: Set<string>;
  player: Player;
  monsters: Monster[];
  lastBulletShotTime: number;
  bullets: Bullet[];
};

export const initMonsters: Monster[] = GameMap.toMonsters(GameMap.init);

export const initState: State = {
  keysDown: new Set(),
  player: initPlayer,
  monsters: initMonsters,
  lastBulletShotTime: 0,
  bullets: [],
};

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "TICK": {
      const player = updatePlayer(state.keysDown, state.player);
      const monsters = updateMonsters({
        walls: Walls.init,
        monsters: state.monsters,
        monsterRandomness: action.monsterRandomness,
        bullets: state.bullets,
      });
      const { lastBulletShotTime, bullets } = updateBullets(
        state.keysDown,
        state.player,
        action.time,
        state.lastBulletShotTime,
        state.bullets,
        state.monsters
      );
      return { ...state, player, monsters, bullets, lastBulletShotTime };
    }
    case "KEY_DOWN": {
      const keysDown = new Set([...state.keysDown, action.key]);
      return { ...state, keysDown };
    }
    case "KEY_UP": {
      const keysDown = new Set(
        [...state.keysDown].filter((key) => key !== action.key)
      );
      return { ...state, keysDown };
    }
  }
};
