import React, { useEffect } from 'react';
import M from 'materialize-css'; // It installs the JS asset only

const importData = props => {
	const names = {
		points: ['pointsImport', 'Wczytaj współrzędne:', '<strong>NR, Y, X, Z [m]</strong>'],
		angles: ['anglesImport', 'Wczytaj kąty:', '<strong>KIERUNEK, Hz, V [grad]</strong>']
	};
	const options = {
		html: `<p>Plik w formacie .csv, dane rozdzielone przecinkami</p>
                ${names[props.type][2]}`
	};

	useEffect(() => {
		var elems = document.querySelectorAll('.tooltipped');
		M.Tooltip.init(elems, options);
	});

	return (
		<div className='valign-wrapper'>
			<div className='col s1 valign-wrapper'>
				<i
					className='tooltipped material-icons teal-text text-lighten-4'
					data-position='bottom'
					data-tooltip={options.html}
				>
					info
				</i>
			</div>
			<div className=' file-field input-field col s11 valign-wrapper'>
				<div className='btn'>
					<span>File</span>
					<input type='file' name={names[props.type][0]} onChange={props.uploadFile} />
				</div>
				<div className='file-path-wrapper'>
					<input
						className='file-path validate'
						placeholder={names[props.type][1]}
						type='text'
						onChange={props.uploadFile}
					/>
				</div>
				{/* <button className="tooltipped" data-position="bottom" data-tooltip="I am a tooltip"></button> */}
			</div>
		</div>
	);
};

export default importData;
