class Person {
	/**
	 * Takes in a object with properties : id, x, y upper_length, lower_length, upper_width, lower_width,
	 * @constructor
	 */
	constructor(params) {
		this.id = params.id;
		this.upper_length = params.upper_length;
		this.upper_width = params.upper_width;
		this.lower_length = params.lower_length;;
		this.lower_width = params.lower_width;
		this.score = 0;
		this.fitness = 0;
		this.parents = [];
		this.colors = [];
		this.params = params;
		this.brain = new NeuralNetwork(5, 20, 5);
		this.upper_left_leg = Matter.Bodies.rectangle(params.x, params.y, params.upper_width, params.upper_length, {
			friction: 0.8,
			restitution: 0.1,
			density: 0.05,
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			}
		});
		this.lower_left_leg = Matter.Bodies.rectangle(params.x , params.y + params.upper_length, params.lower_width, params.lower_length, {
			collisionFilter: {
				category: 0x0002,
				mask: 0x0001,
			},
			friction: 0.8,
			density: 0.05,
			restitution: 0.1,
		});
		this.upper_right_leg = Matter.Bodies.rectangle(params.x - 1, params.y, params.upper_width, params.upper_length, {
			friction: 0.8,
			restitution: 0.1,
			density: 0.05,
			collisionFilter: {
				category: 0x0004,
				mask: 0x0001,
			}
		});
		this.lower_right_leg = Matter.Bodies.rectangle(params.x , params.y + params.upper_length, params.lower_width, params.lower_length, {
			friction: 0.8,
			restitution: 0.1,
			density: 0.05,
			collisionFilter: {
				category: 0x0004,
				mask: 0x0001,
			}
		});
		this.upper_3_leg = Matter.Bodies.rectangle(params.x + 1, params.y, params.upper_width, params.upper_length, {
			friction: 0.8,
			restitution: 0.1,
			density: 0.05,
			collisionFilter: {
				category: 0x0004,
				mask: 0x0001,
			}
		});
		this.lower_3_leg = Matter.Bodies.rectangle(params.x , params.y + params.upper_length, params.lower_width, params.lower_length, {
			friction: 0.8,
			restitution: 0.1,
			density: 0.05,
			collisionFilter: {
				category: 0x0004,
				mask: 0x0001,
			}
		});

		this.init();
	}
	
	init() {
		let selected_color = color(Math.random() * 255, Math.random() * 255, Math.random() * 255);
		this.colors = [selected_color, selected_color];

		this.left_joint = Matter.Constraint.create({
			bodyA: this.upper_left_leg,
			bodyB: this.lower_left_leg,
			pointA: { x: 0, y: this.upper_length / 2 },
			pointB: { x: 0, y: -this.upper_length / 2 },
			length: 0,
			stiffness: 1,
		});

		this.right_joint = Matter.Constraint.create({
			bodyA: this.upper_right_leg,
			bodyB: this.lower_right_leg,
			pointA: { x: 0, y: this.upper_length / 2 },
			pointB: { x: 0, y: -this.upper_length / 2 },
			length: 0,
			stiffness: 1,
		});

		this.right_joint2 = Matter.Constraint.create({
			bodyA: this.upper_3_leg,
			bodyB: this.lower_3_leg,
			pointA: { x: 0, y: this.upper_length / 2 },
			pointB: { x: 0, y: -this.upper_length / 2 },
			length: 0,
			stiffness: 1,
		});

		this.main_joint = Matter.Constraint.create({
			bodyA: this.upper_left_leg,
			bodyB: this.upper_right_leg,
			pointA: { x: 0, y: -this.upper_length / 2 },
			pointB: { x: 0, y: -this.upper_length / 2 },
			length: 0,
			stiffness: 1,
		});

		this.main_joint2 = Matter.Constraint.create({
			bodyA: this.upper_left_leg,
			bodyB: this.upper_3_leg,
			pointA: { x: 0, y: -this.upper_length / 2 },
			pointB: { x: 0, y: -this.upper_length / 2 },
			length: 0,
			stiffness: 1,
		});

		// Muscle Joints
		this.main_muscle = Matter.Constraint.create({
			bodyA: this.upper_left_leg,
			bodyB: this.upper_right_leg,
			length: (this.upper_length / 2),
			stiffness: 1,
		});

		this.main_muscle2 = Matter.Constraint.create({
			bodyA: this.upper_left_leg,
			bodyB: this.upper_3_leg,
			length: (this.upper_length / 2),
			stiffness: 1,
		});

		this.left_muscle = Matter.Constraint.create({
			bodyA: this.upper_left_leg,
			bodyB: this.lower_left_leg,
			length: (this.upper_length / 3) + (this.lower_length / 3),
			stiffness: 1
		});

		this.right_muscle = Matter.Constraint.create({
			bodyA: this.upper_right_leg,
			bodyB: this.lower_right_leg,
			length: (this.upper_length / 3) + (this.lower_length / 3),
			stiffness: 1
		});

		this.third_muscle = Matter.Constraint.create({
			bodyA: this.upper_3_leg,
			bodyB: this.lower_3_leg,
			length: (this.upper_length / 3) + (this.lower_length / 3),
			stiffness: 1
		});
	}

	add_to_world(world) {
		Matter.World.add(world, [this.upper_right_leg, this.upper_left_leg, this.lower_left_leg, this.lower_right_leg, this.lower_3_leg, this.upper_3_leg]);
		Matter.World.add(world, [this.left_joint, this.right_joint, this.right_joint2, this.main_joint, this.main_joint2]);
		Matter.World.add(world, [this.main_muscle,this.main_muscle2, this.left_muscle, this.right_muscle, this.third_muscle]);
	}

	show() {
		fill(this.colors[0]);
		let parts = 4;
		beginShape();
		for (let i = 0; i < parts; i++) {
			vertex(this.upper_left_leg.vertices[i].x, this.upper_left_leg.vertices[i].y);
		}
		endShape();

		fill(this.colors[0])
		beginShape();
		for (let i = 0; i < parts; i++) {
			vertex(this.upper_right_leg.vertices[i].x, this.upper_right_leg.vertices[i].y);
		}
		endShape();

		fill(this.colors[0])
		beginShape();
		for (let i = 0; i < parts; i++) {
			vertex(this.lower_left_leg.vertices[i].x, this.lower_left_leg.vertices[i].y);
		}
		endShape();

		fill(this.colors[0])
		beginShape();
		for (let i = 0; i < parts; i++) {
			vertex(this.lower_right_leg.vertices[i].x, this.lower_right_leg.vertices[i].y);
		}
		endShape();

		fill(this.colors[0])
		beginShape();
		for (let i = 0; i < parts; i++) {
			vertex(this.lower_3_leg.vertices[i].x, this.lower_3_leg.vertices[i].y);
		}
		endShape();

		fill(this.colors[0])
		beginShape();
		for (let i = 0; i < parts; i++) {
			vertex(this.upper_3_leg.vertices[i].x, this.upper_3_leg.vertices[i].y);
		}
		endShape();
	}

	// Movements
	move_m1(change) {
		let max = this.upper_length;
		let temp = muscleMapper(change) * max;
		this.main_muscle.length = temp
	}

	move_m2(change) {
		let max = (this.upper_length / 2) + (this.lower_length / 2);
		let temp = muscleMapper(change) * max;
		this.left_muscle.length = temp;
	}

	move_m3(change) {
		let max = (this.upper_length / 2) + (this.lower_length / 2)
		let temp = muscleMapper(change) * max;
		this.right_muscle.length = temp;
		
	}

	move_m4(change) {
		let max = (this.upper_length / 2) + (this.lower_length / 2)
		let temp = muscleMapper(change) * max;
		this.third_muscle.length = temp;
	}

	move_m5(change) {
		let max = (this.upper_length / 2) + (this.lower_length / 2)
		let temp = muscleMapper(change) * max;
		this.main_muscle2.length = temp;
	}

	adjust_score() {
		let score = this.upper_left_leg.position.x ;
		this.score = score > 0 ? score : 0.001;
	}

	think(boundary) {
		let ground = boundary.ground;
		let distance_from_ground = ground.position.y - ((this.upper_left_leg.position.y + this.upper_right_leg.position.y + this.lower_right_leg.position.y + this.lower_left_leg.position.y + this.upper_3_leg.position.y + this.lower_3_leg.position.y ) / 6)
		let torque = this.upper_left_leg.angularVelocity + this.upper_right_leg.angularVelocity + this.lower_right_leg.angularVelocity + this.lower_left_leg.angularVelocity + this.upper_3_leg.angularVelocity + this.lower_3_leg.angularVelocity;
		let vx = this.upper_left_leg.velocity.x + this.upper_right_leg.velocity.x + this.lower_right_leg.velocity.x + this.lower_left_leg.velocity.x + this.upper_3_leg.velocity.x + this.lower_3_leg.velocity.x ;
		let vy = this.upper_left_leg.velocity.y + this.upper_right_leg.velocity.y + this.lower_right_leg.velocity.y + this.lower_left_leg.velocity.y + this.upper_3_leg.velocity.y + this.lower_3_leg.velocity.y;
		// nearest object
		let agent_x = (this.upper_left_leg.position.x + this.upper_right_leg.position.x +  this.upper_3_leg.position.x ) / 3;
		let dis_obj = 0;

		if (agent_x < boundary.block.position.x){
			dis_obj = boundary.block.position.x - agent_x;
		}
		else if (agent_x < boundary.block2.position.x){
			dis_obj = boundary.block2.position.x - agent_x;
		}
		else
		{
			dis_obj = 0;
		}

		
		let input = [distance_from_ground / width, vx / 4, vy / 4, torque / 4, dis_obj / width];

		let result = this.brain.predict(input);

		this.move_m1(result[0]);
		this.move_m2(result[1]);
		this.move_m3(result[2]);
		this.move_m4(result[3]);
		this.move_m5(result[4]);
	}

	clone() {
		let params = Object.assign({}, this.params);
		let new_person = new Person(params);
		new_person.brain.dispose();
		new_person.brain = this.brain.clone();
		return new_person;
	}

	kill(world) {
		
		Matter.World.remove(world, [this.upper_right_leg, this.upper_left_leg, this.lower_left_leg, this.lower_right_leg, this.lower_3_leg, this.upper_3_leg]);
		Matter.World.remove(world, [this.left_joint, this.right_joint, this.right_joint2, this.main_joint, this.main_joint2]);
		Matter.World.remove(world, [this.main_muscle,this.main_muscle2, this.left_muscle, this.right_muscle, this.third_muscle]);

		// Dispose its brain
		this.brain.dispose();
	}

	mutate() {
		function fn(x) {
			if (random(1) < 0.05) {
				let offset = randomGaussian() * 0.5;
				let newx = x + offset;
				return newx;
			}
			return x;
		}

		let ih = this.brain.input_weights.dataSync().map(fn);
		let ih_shape = this.brain.input_weights.shape;
		this.brain.input_weights.dispose();
		this.brain.input_weights = tf.tensor(ih, ih_shape);
		
		let ho = this.brain.output_weights.dataSync().map(fn);
		let ho_shape = this.brain.output_weights.shape;
		this.brain.output_weights.dispose();
		this.brain.output_weights = tf.tensor(ho, ho_shape);
	}

	crossover(partner) {
		let parentA_in_dna = this.brain.input_weights.dataSync();
		let parentA_out_dna = this.brain.output_weights.dataSync();
		let parentB_in_dna = partner.brain.input_weights.dataSync();
		let parentB_out_dna = partner.brain.output_weights.dataSync();

		let mid = this.score/partner.score;

		//let mid = Math.floor(Math.random() * parentA_in_dna.length);
		let child_in_dna = [...parentA_in_dna.slice(0, mid), ...parentB_in_dna.slice(mid, parentB_in_dna.length)];		
		let child_out_dna = [...parentA_out_dna.slice(0, mid), ...parentB_out_dna.slice(mid, parentB_out_dna.length)];

		let child = this.clone();
		let input_shape = this.brain.input_weights.shape;
		let output_shape = this.brain.output_weights.shape;
		
		child.brain.dispose();

		child.brain.input_weights = tf.tensor(child_in_dna, input_shape);
		child.brain.output_weights = tf.tensor(child_out_dna, output_shape);
		
		return child;
	}

	walk() {
		setInterval(() => {
			this.think(boundary)
		}, 100)
	}
}

/**
 * Quantizes the muslce movement.
 * @param {number} change - Accepts number between 0 and 1
 * @returns {number} Returns either 0.5 or 1.
 */
function muscleMapper (change) {
	if (change > 1) return null;
	if (change < 0.5) return 0.5 ;
	else return 1;

	// if (change < 0.33) return 0.33 ;
	// else if (change < 0.67) return 0.67;
	// else if (change < 1) return 0.90;
}