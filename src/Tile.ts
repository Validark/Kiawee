export class Tile {
	pLogP: number;
	constructor(public model: Model, public probability: number, public index: number) {
		this.pLogP = probability * math.log(probability);
	}
}
