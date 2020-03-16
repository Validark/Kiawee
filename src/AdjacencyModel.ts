import ITile from "./Interfaces/ITile";
import { Tile } from "./Tile";
export class AdjacencyModel {
	tiles: Array<Tile> = [];
	constructor(tileDefinitions: Array<ITile>) {
		for (const definition of tileDefinitions) {
			this.tiles.push(new Tile(definition.model, definition.probability));
		}
	}
}
