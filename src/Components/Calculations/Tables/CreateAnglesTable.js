import React from 'react'

let count = 0;

const createAnglesTable = (props) => {

   
    // const clickCount = (e) => {
        
    //     console.log(e.target.checked);
    //     if(e.target.checked){
    //         count ++;
    //         let node = document.createElement("div");
    //         node.innerHTML = count;
    //         e.target.closest("td").appendChild(node);
    //     } else if(!e.target.checked){
    //         count --;
    //         let node = e.target.closest("td").childNodes;
    //         node[1].remove();
    //     }
        
    // }

  return(<table className="centered table-directions">
    <thead>
        <tr>
            <th>
                {/* <input type="checkbox" onClick={(e)=>props.handleCheckedAllAngles(e)} /> */}
            </th>
            <th>Kierunek</th>
            <th>Hz [grad]</th>
            <th>V [grad]</th>

        </tr>
    </thead>
    <tbody>
    {props.directions.map((el) => {
        
    return(
            <tr key={el.number}  >
                <td>
                <label>
                    <input className="angleCheck" type="checkbox"  onChange= {()=>props.toggleChange(el)}  />
                    <span>{props.markNr}</span>
                </label>
                </td>
                <td>{el.number}</td>
                <td>{el.h.toFixed(4)}</td>
                <td>{el.v.toFixed(4)}</td>
            </tr>
    ); 
    })}
</tbody>
</table>);
}

export default createAnglesTable;