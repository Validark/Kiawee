import * as Kiawe from "./index";

export = () => {
	HACK_NO_XPCALL();

	it("exports base classes, adjacencymodel, and the propagator", () => {
		expect(Kiawe["BaseTopology"]).to.be.ok();
		expect(Kiawe["AdjacencyModel"]).to.be.ok();
		expect(Kiawe["Propagator"]).to.be.ok();
	});

	it("Simply works", () => {
		const Topology = new Kiawe.GridTopology(new Vector3(5, 1, 5), new Vector3(5, 5, 5));

		const placeholderModel1 = new Instance("Model");

		const placeholderPart = new Instance("Part");
		placeholderPart.Anchored = true;
		placeholderPart.Size = new Vector3(5, 5, 5);
		placeholderPart.Color = Color3.fromRGB(255, 0, 0);
		placeholderPart.Parent = placeholderModel1;

		placeholderModel1.PrimaryPart = placeholderPart;

		const placeholderModel2 = new Instance("Model");
		const placeholderPart2 = new Instance("Part");
		placeholderPart2.Anchored = true;
		placeholderPart2.Size = new Vector3(5, 5, 5);
		placeholderPart2.Color = Color3.fromRGB(0, 255, 0);
		placeholderPart2.Parent = placeholderModel2;

		placeholderModel2.PrimaryPart = placeholderPart2;

		const AdjacencyModel = new Kiawe.AdjacencyModel([
			{
				probability: 1,
				model: placeholderModel1,
			},
			{
				probability: 1,
				model: placeholderModel2,
			},
		]);

		const Propagator = new Kiawe.Propagator(Topology, AdjacencyModel, {
			Debug: true,
		});

		Propagator.Run();
	});
};
