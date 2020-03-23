import { Tile } from "./Tile";
import { Propagator } from "./Propagator";
import { BaseTopology } from "Topology";
export class Slot {
	entropy: number;
	confirmedTile: undefined | Tile;
	tiles: Array<Tile>;

	debugInstance: Part;
	modulesDisplay: TextLabel;

	private propagator: Readonly<Propagator<BaseTopology>>;

	constructor(public pos: Vector3, tiles: Array<Tile>, propagator: Propagator<BaseTopology>) {
		this.tiles = tiles.copy();

		this.entropy = this.CalculateEntropy();

		const DebugInst = new Instance("Part");
		DebugInst.Size = new Vector3(5, 5, 5);
		DebugInst.Transparency = 0.8;
		DebugInst.Position = pos;
		DebugInst.Anchored = true;
		DebugInst.Parent = game.Workspace;

		const DebugDisplay = new Instance("SurfaceGui");
		DebugDisplay.Face = Enum.NormalId.Top;
		DebugDisplay.Parent = DebugInst;

		const modulesDisplay = new Instance("TextLabel");
		modulesDisplay.Parent = DebugDisplay;
		modulesDisplay.Size = new UDim2(1, 0, 1, 0);
		modulesDisplay.BackgroundTransparency = 1;
		modulesDisplay.TextScaled = true;
		modulesDisplay.Text = tostring(this.tiles.size());

		this.debugInstance = DebugInst;
		this.modulesDisplay = modulesDisplay;

		this.propagator = propagator;
	}

	CalculateEntropy() {
		const totalProbability = this.tiles.reduce((accumulator, tile) => {
			return accumulator + tile.probability;
		}, 0);

		const totalPLogP = this.tiles.reduce((accumulator, tile) => {
			return accumulator + tile.pLogP;
		}, 0);

		return (-1 / totalProbability) * totalPLogP + math.log(totalProbability);
	}

	Collapse(tile: Tile) {
		this.confirmedTile = tile;

		//I don't want to mutate the original tiles
		const excessTiles = this.tiles.filter(item => {
			return item !== this.confirmedTile;
		});

		this.RemoveTiles(excessTiles);

		//physically build
		const clone = this.confirmedTile.model.Clone();
		clone.SetPrimaryPartCFrame(new CFrame(this.pos));
		clone.Parent = game.Workspace;

		this.debugInstance.Destroy();
	}

	ContainsTile(tileIndex: string) {
		return this.tiles.find(tile => {
			return tile.index === tileIndex;
		});
	}

	RemoveTiles(tiles: Array<Tile>) {
		print("Removing tiles");
		for (const tile of tiles) {
			const tileIndex = this.tiles.indexOf(tile);
			//Now we mutate >:)
			this.tiles.remove(tileIndex);

			//Might be useful to cache this somewhere later
			const slotNeighbors = this.propagator.topology.GetNeighbors(this.pos);

			for (const [dir, neighborCoord] of Object.entries(slotNeighbors)) {
				// eslint-disable-next-line roblox-ts/no-object-math
				const neighbor = this.propagator.slots.find(slot => slot.pos === neighborCoord);

				if (neighbor) {
					neighbor.debugInstance.Size = new Vector3(2.5, 2.5, 2.5).mul(neighbor.tiles.size());
					neighbor.debugInstance.Color = Color3.fromRGB(0, 0, 255);
				}
			}
		}
	}

	//Test
	CollapseRandom() {
		let totalWeight = 0;

		for (const tile of this.tiles) {
			totalWeight += tile.probability;
		}

		let random = this.propagator.random.NextInteger(1, totalWeight);

		for (const tile of this.tiles) {
			if (random <= tile.probability) {
				this.Collapse(tile);
				return;
			} else {
				random -= tile.probability;
			}
		}

		const firstTile = this.tiles.find(x => x !== undefined);

		if (firstTile) {
			this.Collapse(firstTile);
		}
	}
}
