import { Tile } from "./Tile";
export class Slot {
	constructor(public pos: Vector3, public tiles: Array<Tile>) {}
}
