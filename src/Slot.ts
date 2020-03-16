import { Tile } from "./Tile";
export class Slot {
	Entropy: number;
	constructor(public pos: Vector3, public tiles: Array<Tile>) {
		this.Entropy = this.CalculateEntropy();
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
}
