import { updateMonsters } from "./updateMonsters";
import { type State, type Action, walls } from "../components/Game";
import { updateBullets } from "./updateBullets";
import { updatePlayer } from "./updatePlayer";

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "TICK": {
      const player = updatePlayer(state.keysDown, state.player);
      const monsters = updateMonsters({
        walls,
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
