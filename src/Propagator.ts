import { Topology } from "./Topology";
import { AdjacencyModel } from "./AdjacencyModel";
import { Slot } from "./Slot";

import PropagatorOptions from "./Interfaces/PropagatorOptions";

export class Propagator {
	slots: Array<Slot> = [];
	constructor(private topology: Topology, private model: AdjacencyModel, options: PropagatorOptions) {
		for (const position of topology.slots) {
			this.slots.push(new Slot(position, model.tiles));
		}
	}

	Run() {
		// we gotta test this
		const AvailableModuleTotal = this.slots.reduce((total, slot) => {
			return total - slot.tiles.size();
		}, 0);

		while (AvailableModuleTotal > 0) {
			//this could be a bad idea in the future and result in infinite yielding
		}
	}
}
