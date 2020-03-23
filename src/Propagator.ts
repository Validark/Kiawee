import { BaseTopology } from "./Topology";
import { AdjacencyModel } from "./AdjacencyModel";
import { Slot } from "./Slot";
import { Tile } from "./Tile";

import PropagatorOptions from "./Interfaces/PropagatorOptions";

export class Propagator<T extends BaseTopology> {
	slots: Array<Slot> = [];

	RemovalQueue: Array<{
		tile: Tile;
		slot: Slot;
	}> = [];

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
		const collapseFiltered = this.slots.filter(slot => {
			return !slot.confirmedTile;
		});

		return collapseFiltered.reduce((total, slot) => {
			return total + slot.tiles.size();
		}, 0);
	}

	Run() {
		let availableModulesLeft = this.GetAvailableModulesLeft();

		//this could be a bad idea in the future and result in infinite yielding
		while (availableModulesLeft > 0) {
			wait(5);

			for (const slot of this.slots) {
				slot.entropy = slot.CalculateEntropy();
			}

			const lowestEntropy = this.FindLowestEntropy();
			lowestEntropy.CollapseRandom();

			availableModulesLeft = this.GetAvailableModulesLeft();

			if (this.options.Debug) {
				print(`${availableModulesLeft} modules left in wave function`);

				for (const slot of this.slots) {
					slot.modulesDisplay.Text = tostring(slot.tiles.size());
					slot.entropyDisplay.Text = tostring(slot.entropy);
				}
			}
		}

		if (this.options.Debug) {
			print("We finished!");
		}
	}

	FinishRemovalQueue() {
		while (this.RemovalQueue.size() > 0) {
			const entry = this.RemovalQueue.pop();

			if (entry && !entry.slot.confirmedTile) {
				entry.slot.RemoveTiles([entry.tile], false);
			}
		}
	}

	//need to test
	private FindLowestEntropy(): Slot {
		const sorted = this.slots.sort((a, b) => {
			return a.entropy < b.entropy;
		});

		return sorted.filter(slot => {
			return slot.confirmedTile === undefined;
		})[0];
	}

	private CreateInitialTileHealth(tiles: Array<Tile>) {
		const initialTileHealth: {
			[direction: string]: {
				[Index: string]: number;
			};
		} = {};

		for (const [dirName, dirVector] of Object.entries(this.topology.Directions)) {
			const inverseDirName = this.model.GetInverseDirection(dirName);
			initialTileHealth[dirName] = {};

			for (const tile of tiles) {
				for (const possibleNeighborIndex of tile.possibleNeighbors[inverseDirName]) {
					if (initialTileHealth[dirName][possibleNeighborIndex] === undefined) {
						initialTileHealth[dirName][possibleNeighborIndex] = 0;
					}

					initialTileHealth[dirName][possibleNeighborIndex]++;
				}
			}
		}

		return initialTileHealth;
	}
}
