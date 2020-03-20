import { Slot } from "./Slot";

interface NeighborReturn {
	[index: string]: Vector3 | undefined;
}
export abstract class BaseTopology {
	constructor(public slots: Array<Vector3>) {}

	/**
	 * @param slotPos coordinates of slot you want to find neighbors of
	 * @returns a dictionary containing the coordinates of neighbors for each direction
	 */
	abstract GetNeighbors(slotPos: Vector3): NeighborReturn;
}

const Directions = {
	Left: new Vector3(-1, 0, 0),
	Right: new Vector3(1, 0, 0),
	Front: new Vector3(0, 0, -1),
	Back: new Vector3(0, 0, 1),
	Top: new Vector3(0, 1, 0),
	Bottom: new Vector3(0, -1, 0),
};
export class GridTopology extends BaseTopology {
	private slotSize: Vector3;

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

		this.slotSize = slotSize;
	}

	//Need to test
	GetNeighbors(slotPos: Vector3) {
		const neighbors: NeighborReturn = {};

		for (const [dirName, vector] of Object.entries(Directions)) {
			const neighborCoords = slotPos.add(vector.mul(this.slotSize));

			// eslint-disable-next-line roblox-ts/no-object-math
			const neighbor = this.slots.find(slotCoords => slotCoords === neighborCoords);

			if (neighbor) {
				neighbors[dirName] = neighbor;
			}
		}

		return neighbors;
	}
}
