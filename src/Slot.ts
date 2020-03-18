import { Tile } from "./Tile";
import { Propagator } from "./Propagator";
export class Slot {
	entropy: number;
	confirmedTile: undefined | Tile;

	private propagator: Readonly<Propagator>;
	constructor(public pos: Vector3, public tiles: Array<Tile>, propagator: Propagator) {
		this.entropy = this.CalculateEntropy();

		this.propagator = propagator;
	}

	CalculateEntropy() {
		const totalProbability = this.tiles.reduce((accumulator, tile) => {
			return accumulator + tile.probability;
		}, 0);

		const totalPLogP = this.tiles.reduce((accumulator, tile) => {
			return accumulator + tile.pLogP;
		}, 0);

		return (-1 / totalProbability) * totalPLogP + math.log(totalProbability);
	}

	Collapse(tileIndex: number) {
		this.tiles.remove(tileIndex);
	}
}
