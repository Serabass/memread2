import {Game} from "../src/entities";

describe('lib test', () => {
    it('x', () => {
        expect(Game.instance.vehicles.length).toBe(0);
    });
});
