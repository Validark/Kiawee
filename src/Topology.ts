import { Slot } from "./Slot";
export abstract class BaseTopology {
	constructor(public slots: Array<Vector3>) {}
}

export class GridTopology extends BaseTopology {
	constructor(gridSize: Vector3, slotSize: Vector3) {
		const slots: Array<Vector3> = [];

		for (let x = 0; x < gridSize.X; x++) {
			for (let y = 0; y < gridSize.Y; y++) {
				for (let z = 0; z < gridSize.Z; z++) {
					slots.push(new Vector3(x * slotSize.X, y * slotSize.Y, z * slotSize.Z));
				}
			}
		}
		super(slots);
	}
}
