import { BaseTopology } from "./Topology";
import { AdjacencyModel } from "./AdjacencyModel";
import { Slot } from "./Slot";

import PropagatorOptions from "./Interfaces/PropagatorOptions";

export class Propagator {
	slots: Array<Slot> = [];
	readonly random: Random;
	constructor(private topology: BaseTopology, private model: AdjacencyModel, private options: PropagatorOptions) {
		for (const position of topology.slots) {
			this.slots.push(new Slot(position, model.tiles, this));
		}

		if (options.Seed !== undefined) {
			this.random = new Random(options.Seed);
		} else {
			this.random = new Random();
		}
	}

	Run() {
		// we gotta test this
		const availableModuleTotal = this.slots.reduce((total, slot) => {
			return total - slot.tiles.size();
		}, 0);

		if (this.options.Debug) {
			print(`${availableModuleTotal} modules left in wave function`);
		}

		//this could be a bad idea in the future and result in infinite yielding
		while (availableModuleTotal > 0) {
			const lowestEntropy = this.FindLowestEntropy();

			lowestEntropy.CollapseRandom();
		}

		if (this.options.Debug) {
			print("We finished!");
		}
	}

	//need to test
	private FindLowestEntropy(): Slot {
		return this.slots.sort((a, b) => {
			return a.entropy > b.entropy;
		})[0];
	}
}
