interface ITile<RuleIndex extends string> {
	probability: number;
	model: Model;
	rules: {
		[key in RuleIndex]: string;
	};
}

export = ITile;
