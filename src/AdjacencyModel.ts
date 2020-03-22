import ITile from "./Interfaces/ITile";
import { Tile } from "./Tile";
import { BaseTopology } from "./Topology";

export class AdjacencyModel<T extends BaseTopology> {
	tiles: Array<Tile> = [];
	constructor(public topology: T, public tileDefinitions: Array<ITile<string>>) {
		let index = 0;
		for (const definition of tileDefinitions) {
			this.tiles.push(new Tile(definition.model, definition.probability, index));
			index++;
		}
	}

	private GetPossibleNeighbors(tileDefinition: ITile<string>) {
		const PossibleNeighbors: {
			[direction: string]: Array<number>; //Array of tile indexes
		} = {};

		for (const [dirName, dirVector] of Object.entries(this.topology.Directions)) {
			PossibleNeighbors[dirName] = [];

			for (const definition of this.tileDefinitions) {
				if (definition.rules[dirName]) {
				}
			}
		}
	}
}
