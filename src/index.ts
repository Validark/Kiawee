import { Topology } from "./Topology";
import { AdjacencyModel } from "./AdjacencyModel";

import PropagatorOptions from "./Interfaces/PropagatorOptions";

export class Propagator {
	constructor(protected topology: Topology, protected model: AdjacencyModel, protected options: PropagatorOptions) {}
}

export { AdjacencyModel };
export { Topology };
