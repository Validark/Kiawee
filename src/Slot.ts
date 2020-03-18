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

	Collapse(tile: Tile) {
		this.confirmedTile = tile;

		this.tiles = []; //empty array by garbage collecting current one

		//physically build
		const clone = this.confirmedTile.model.Clone();
		clone.SetPrimaryPartCFrame(new CFrame(this.pos));
		clone.Parent = game.Workspace;
		//propagate
		
	}

	//Test
	CollapseRandom() {
		let totalWeight = 0;

		for (const tile of this.tiles) {
			totalWeight += tile.probability;
		}

		let random = this.propagator.random.NextInteger(1, totalWeight);

		for (const tile of this.tiles) {
			if (random <= tile.probability) {
				this.Collapse(tile);
				return;
			} else {
				random -= tile.probability;
			}
		}

		const firstTile = this.tiles.find(x => x !== undefined);

		if (firstTile) {
			this.Collapse(firstTile);
		}
	}
}
