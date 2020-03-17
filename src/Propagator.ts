import { Topology } from "./Topology";
import { AdjacencyModel } from "./AdjacencyModel";
import { Slot } from "./Slot";

import PropagatorOptions from "./Interfaces/PropagatorOptions";

export class Propagator {
	slots: Array<Slot> = [];
	private random: Random;
	constructor(private topology: Topology, private model: AdjacencyModel, private options: PropagatorOptions) {
		for (const position of topology.slots) {
			this.slots.push(new Slot(position, model.tiles));
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

		while (availableModuleTotal > 0) {
			//this could be a bad idea in the future and result in infinite yielding
			const lowestEntropy = this.FindLowestEntropy();

			const index = this.random.NextInteger(0, lowestEntropy.tiles.size());
			lowestEntropy.tiles.remove(index);
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
