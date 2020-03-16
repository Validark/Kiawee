import { BaseConstraint } from "../Constraints/BaseConstraint";

interface PropagatorOptions {
	Constraints?: Array<BaseConstraint>;
	Seed?: number;
	BackTraceLimit: 0 | -1 | number;
}

export = PropagatorOptions;
