export class Tile {
	pLogP: number;
	constructor(public model: Model, public probability: number, public index: string) {
		this.pLogP = probability * math.log(probability);
	}
}
