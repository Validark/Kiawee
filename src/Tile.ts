export class Tile {
	pLogP: number;
	constructor(public model: Model, public probability: number) {
		this.pLogP = probability * math.log(probability);
	}
}
