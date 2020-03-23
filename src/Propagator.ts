import { BaseTopology } from "./Topology";
import { AdjacencyModel } from "./AdjacencyModel";
import { Slot } from "./Slot";
import { Tile } from "./Tile";

import PropagatorOptions from "./Interfaces/PropagatorOptions";

export class Propagator<T extends BaseTopology> {
	slots: Array<Slot> = [];

	readonly random: Random;

	private initialTileHealth: {
		[direction: string]: {
			[Index: string]: number;
		};
	};

	constructor(public topology: T, public model: AdjacencyModel<T>, private options: PropagatorOptions) {
		this.initialTileHealth = this.CreateInitialTileHealth(model.tiles);

		for (const position of topology.slots) {
			this.slots.push(new Slot(position, model.tiles, this, this.initialTileHealth));
		}

		if (options.Seed !== undefined) {
			this.random = new Random(options.Seed);
		} else {
			this.random = new Random();
		}
	}

	GetAvailableModulesLeft(): number {
		return this.slots.reduce((total, slot) => {
			return total + slot.tiles.size();
		}, 0);
	}

	Run() {
		let availableModulesLeft = this.GetAvailableModulesLeft();

		//this could be a bad idea in the future and result in infinite yielding
		while (availableModulesLeft > 0) {
			wait(10);

			const lowestEntropy = this.FindLowestEntropy();
			lowestEntropy.CollapseRandom();

			availableModulesLeft = this.GetAvailableModulesLeft();

			if (this.options.Debug) {
				print(`${availableModulesLeft} modules left in wave function`);

				for (const slot of this.slots) {
					slot.modulesDisplay.Text = tostring(slot.tiles.size());
				}
			}
		}

		if (this.options.Debug) {
			print("We finished!");
		}
	}

	//need to test
	private FindLowestEntropy(): Slot {
		const sorted = this.slots.sort((a, b) => {
			return a.entropy > b.entropy;
		});

		return sorted.filter(slot => {
			return slot.confirmedTile === undefined;
		})[0];
	}

	private CreateInitialTileHealth(tiles: Array<Tile>) {
		const initialTileHealth = {};

		for (const [dirName, dirVector] of Object.entries(this.topology.Directions)) {
			const inverseDirName = this.model.GetInverseDirection(dirName);
			this.initialTileHealth[dirName] = {};

			for (const tile of tiles) {
				for (const possibleNeighborIndex of tile.possibleNeighbors[inverseDirName]) {
					this.initialTileHealth[dirName][possibleNeighborIndex]++;
				}
			}
		}

		return initialTileHealth;
	}
}
