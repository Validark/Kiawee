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

		const AdjacencyModel = new Kiawe.AdjacencyModel(Topology, [
			{
				probability: 1,
				model: placeholderModel1,
				rules: {
					Left: "1",
					Right: "1",
					Front: "1",
					Back: "1",
					Top: "1",
					Bottom: "1",
				},
				index: "1",
			},
			{
				probability: 1,
				model: placeholderModel2,
				rules: {
					Left: "2",
					Right: "2",
					Front: "2",
					Back: "2",
					Top: "2",
					Bottom: "2",
				},
				index: "2",
			},
		]);

		//Proper results would either be 100% green or 100% red

		print("Adjacency model created");

		const Propagator = new Kiawe.Propagator(Topology, AdjacencyModel, {
			Debug: true,
		});

		print("Propagator created");

		Propagator.Run();

		print("Propagator ran");
	});
};
