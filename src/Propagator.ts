import { Topology } from "./Topology";
import { AdjacencyModel } from "./AdjacencyModel";

import PropagatorOptions from "./Interfaces/PropagatorOptions";

export class Propagator {
	constructor(private topology: Topology, private model: AdjacencyModel, options: PropagatorOptions) {}
}
