import * as d3 from 'd3';

const CreateGraphXZ = props => {
	if (props.drawGraph.points.length === 3) {
		let margin = {
				top: 20,
				right: 50,
				bottom: 30,
				left: 50
			},
			width = 900 - margin.left - margin.right,
			height = 500 - margin.top - margin.bottom;

		let allPoints = [...props.drawGraph.points, ...props.drawGraph.intersect];

		let basePoint = [];
		let stationPoint = [];

		props.drawGraph.points.forEach(el => {
			if (el.target === 'Pkt1' || el.target === 'Pkt2') {
				basePoint.push(el);
			} else if (el.target === 'Stan') {
				stationPoint.push(el);
			}
		});

		let x = d3
			.scaleLinear()
			.range([0, width])
			.domain(
				d3.extent(allPoints, function(d) {
					return d.x;
				})
			);
		let y = d3
			.scaleLinear()
			.range([height, 0])
			.domain(
				d3.extent(allPoints, function(d) {
					return d.z;
				})
			);

		// define the line
		let valueline = d3
			.line()
			.x(function(d) {
				return x(d.x);
			})
			.y(function(d) {
				return y(d.z);
			})
			.curve(d3.curveCatmullRom.alpha(0.5));

		d3.selectAll('svg').remove();

		let svg = d3
			.select('.graphBox')
			.append('svg')
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

		svg.append('path')
			.data([[...props.drawGraph.intersect]])
			.attr('class', 'line')
			.attr('d', valueline)
			.attr('fill', 'none')
			.attr('stroke', 'steelblue')
			.attr('stroke-width', '1.5px');

		svg.selectAll('circle')
			.data(allPoints)
			.enter()
			.append('circle')
			.attr('r', 3.5)
			.attr('cx', function(d) {
				return x(d.x);
			})
			.attr('cy', function(d) {
				return y(d.z);
			});

		svg.selectAll('text')
			.data(allPoints)
			.enter()
			.append('text')
			.attr('x', function(d) {
				return x(d.x);
			})
			.attr('y', function(d) {
				return y(d.z);
			})
			.attr('dx', '20px')
			.attr('dy', '20px')
			.attr('font-size', '16px')
			.text(function(d) {
				return d.number;
			});

		// Add the X Axis
		svg.append('g')
			.attr('transform', 'translate(0,' + height + ')')
			.call(d3.axisBottom(x));

		// Add the Y Axis
		svg.append('g').call(d3.axisLeft(y));
	} else {
		d3.selectAll('svg').remove();
	}

	return null;
};

export default CreateGraphXZ;
