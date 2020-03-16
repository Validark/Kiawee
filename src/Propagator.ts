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

	Run() {}
}
