import React, { Component } from 'react';
import CreatePointsTable from './Tables/CreatePointsTable';
import CreateAnglesTable from './Tables/CreateAnglesTable';
import CreateGraphXY from './Graphs/CreateGraphXY';
import CreateGraphXZ from './Graphs/CreateGraphXZ';
import Flatten from 'flatten-js';
import OutputTable from './Tables/OutputTable';
import M from 'materialize-css'; // It installs the JS asset only
import 'materialize-css/dist/css/materialize.min.css';
const { line, vector } = Flatten;

class Calc extends Component {
	state = {
		points: [],
		vectors: [],
		intersect: [],
		graphType: 'xy'
	};

	componentDidMount() {
		var elems = document.querySelectorAll('.fixed-action-btn');
		M.FloatingActionButton.init(elems);
	}

	addPointToGraph = (target, point) => {
		if (target === 'default') {
			let newState = {
				...this.state
			};
			let id = newState.points.findIndex(x => x.number === point.number);
			newState.points.splice(id, 1);
			console.log(id, point);
			this.setState({
				intersect: []
			});
			this.setState({
				points: newState.points
			});
		} else if (target !== 'default' && this.state.points.length < 3) {
			let newState = {
				...this.state
			};
			let id = newState.points.findIndex(x => x.number === point.number);
			if (id !== -1) {
				newState.points.splice(id, 1);
			}
			newState.points.push({
				...point,
				target
			});
			this.setState({
				points: newState.points
			});
		}
	};

	createPointHz = el => {
		let pkt = this.state.points.findIndex(x => x.target === el);
		if (pkt !== -1) return new Flatten.Point(this.state.points[pkt].x, this.state.points[pkt].y);
	};

	createPointVert = el => {
		let pkt = this.state.points.findIndex(x => x.target === el);
		if (pkt !== -1) return new Flatten.Point(this.state.points[pkt].x, this.state.points[pkt].z);
	};

	toggleChange = el => {
		let newState = [...this.state.vectors];

		if (!el.isChecked) {
			el.isChecked = true;
			newState.push(el);
		} else if (el.isChecked) {
			el.isChecked = false;
			let id = newState.findIndex(x => x.number === el.number);
			newState.splice(id, 1);
		}

		this.setState({
			vectors: newState
		});
	};

	handleCalculateIntersection = data => {
		if (data.points.length >= 3) {
			let mainLine = [];
			let stationPoint = [];
			let intersectBox = [];

			data.points.forEach(el => {
				if (el.target === 'Pkt1' || el.target === 'Pkt2') {
					mainLine.push(el);
				} else if (el.target === 'Stan') {
					stationPoint.push(el);
				}
			});

			let pointA_XY = this.createPointHz('Pkt1');
			let pointB_XY = this.createPointHz('Pkt2');
			let pointStan_XY = this.createPointHz('Stan');

			// let pointA_XZ = this.createPointVert('Pkt1');
			// let pointB_XZ = this.createPointVert('Pkt2');
			let pointStan_XZ = this.createPointVert('Stan');

			if (pointA_XY && pointB_XY && pointStan_XY) {
				let baseLine_XY = line(pointA_XY, pointB_XY);
				let mainVector_XY = vector(pointStan_XY, pointA_XY);
				// let mainVector_XZ = vector(point(0, 0), point(0, 100));

				if (this.state.vectors.length > 0) {
					let pkt1 = null;
					mainLine.forEach(el => {
						if (el.target === 'Pkt1') {
							pkt1 = el;
						}
					});

					let firstAzymuth = this.state.vectors.find(x => x.number === pkt1.number);
					try {
						if (firstAzymuth) {
							this.state.vectors.forEach(el => {
								let angleHz = el.h - firstAzymuth.h;
								let angleVert = el.v < 200 ? el.v : 400 - el.v;

								let angleHzRadian = (-(angleHz + 100) * Math.PI) / 200;
								let angleVertRadian = ((100 - angleVert) * Math.PI) / 200;

								let nextVector_XY = mainVector_XY.rotate(angleHzRadian, pointStan_XY);

								let nextLine_XY = line(pointStan_XY, nextVector_XY);
								let crossSection = nextLine_XY.intersect(baseLine_XY);

								let dist = pointStan_XY.distanceTo(crossSection[0]);

								if (!dist) {
									throw new Error('Błąd na punkcie ' + el.number);
								}

								let height;
								if (Math.tan(angleVertRadian) !== 0) {
									height = dist[0] / Math.tan(angleVertRadian);
								}

								let height_XZ = height + pointStan_XZ.y;

								console.log(pointStan_XZ, height_XZ);

								let nr = el.number;

								if (crossSection[0]) {
									intersectBox.push(
										Object.assign(
											{
												number: nr,
												z: height_XZ
											},
											{
												...crossSection[0]
											}
										)
									);
								}
							});
						}
					} catch (error) {
						console.log(error.name, error.message);
						alert(error.message);
					}
				} else {
					M.toast({ html: 'Zaznacz punkt nawiązania oraz kierunki do obliczenia.', classes: 'red' });
					let table = document.querySelectorAll('.table-directions')[0];
					table.classList.add('warningMark');
					table.addEventListener('animationend', function(el) {
						this.classList.remove('warningMark');
					});
				}
				this.setState({
					intersect: intersectBox
				});
			}
		} else {
			M.toast({ html: 'Ustal stanowisko oraz punkty zaczepienia.', classes: 'red' });
			let table = document.querySelectorAll('.table-coordinate select');
			table.forEach(el => {
				console.log(el);
				el.classList.add('warningMark');
				el.addEventListener('animationend', function(el) {
					this.classList.remove('warningMark');
				});
			});
		}
	};

	render() {
		return (
			<div>
				<div className='fixed-action-btn'>
					<button
						className='btn-floating btn-large waves-effect red'
						onClick={() => {
							this.handleCalculateIntersection(this.state);
						}}
					>
						Oblicz
					</button>
				</div>

				<div className='row'>
					<div className='col s6'>
						<CreatePointsTable
							coordinate={this.props.data.coordinate}
							addPointToGraph={(value, el) => this.addPointToGraph(value, el)}
							points={this.state.points}
						/>
					</div>
					<div className='col s6'>
						<CreateAnglesTable
							directions={this.props.data.direction}
							handleCheckedAllAngles={this.handleCheckedAllAngles}
							vectors={this.state.vectors}
							toggleChange={this.toggleChange}
							markNr={this.state.vectors.number}
						/>
					</div>
				</div>

				{this.state.intersect.length > 0 ? <OutputTable intersectPoints={this.state.intersect} /> : null}
				<div className='container'>
					{this.state.graphType === 'xy' ? <CreateGraphXY drawGraph={this.state} /> : null}
					{this.state.graphType === 'xz' ? <CreateGraphXZ drawGraph={this.state} /> : null}
				</div>

				<div>
					<div className='selectGraphType row'>
						{this.state.intersect.length > 0 ? (
							<div className='col s4 offset-s4 center-align'>
								<p>Zmień typ wykresu:</p>
								<select
									className='browser-default'
									onChange={e => this.setState({ graphType: e.target.value })}
								>
									<option value='xy'>XY</option>
									<option value='xz'>XZ</option>
								</select>
							</div>
						) : null}
					</div>
					<div className='row graphBox' />
				</div>
			</div>
		);
	}
}

export default Calc;
