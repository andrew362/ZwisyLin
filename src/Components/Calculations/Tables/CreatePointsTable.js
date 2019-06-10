import React from 'react';

const createPointsTable = props => {
	return (
		<table className='centered table-coordinate'>
			<thead>
				<tr>
					<th />
					<th>Numer</th>
					<th>X [m]</th>
					<th>Y [m]</th>
					<th>Z [m]</th>
				</tr>
			</thead>
			<tbody>
				{props.coordinate.map(el => {
					return (
						<tr key={el.number}>
							<td>
								<select
									className='browser-default'
									onChange={event => props.addPointToGraph(event.target.value, el)}
								>
									<option value='default'>-</option>
									<option
										disabled={props.points.find(x => x.target === 'Pkt1') ? true : false}
										value='Pkt1'
									>
										Pkt1
									</option>
									<option
										disabled={props.points.find(x => x.target === 'Pkt2') ? true : false}
										value='Pkt2'
									>
										Pkt2
									</option>
									<option
										disabled={props.points.find(x => x.target === 'Stan') ? true : false}
										value='Stan'
									>
										Stan
									</option>
								</select>
							</td>
							<td>{el.number}</td>
							<td>{el.x.toFixed(2)}</td>
							<td>{el.y.toFixed(2)}</td>
							<td>{el.z.toFixed(2)}</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	);
};

export default createPointsTable;
