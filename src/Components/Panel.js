import React from 'react';
import ImportData from './Imports/ImportData';
import '../App.css';
import M from 'materialize-css';

const Panel = (props) => {
	let elems = document.querySelectorAll('.tooltipped');
	M.Tooltip.init(elems);

	return (
		<div>
			<div className='row valign-wrapper'>
				<div className='col m5 s12 '>
					<ImportData uploadFile={props.handleselectedFile} type='points' />
				</div>
				<div className='col  m5 s12'>
					<ImportData uploadFile={props.handleselectedFile} type='angles' />
				</div>
				<div className='col m2 s12 '>
					<button className='btn waves-effect waves-light' onClick={props.handleProcessData}>
						Upload
					</button>
				</div>
			</div>
			<div className='row'>
				<button
					className='waves-light btn-small tooltipped'
					data-position='bottom'
					data-tooltip='Ustaw: <br> &#39;Stan&#39; -> pkt. A <br> &#39;Pkt1&#39; -> pkt. B <br> &#39;Pkt2&#39; -> pkt. C'
					onClick={props.uploadTestData}
				>
					Wczytaj przykładowe dane
				</button>
			</div>
		</div>
	);
};

export default Panel;
