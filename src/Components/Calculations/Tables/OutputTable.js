import React from 'react'



const outputTable = (props) => {
  return(<table  className="centered" >
    <thead>
        <tr>
            <th>Numer</th>
            <th>X</th>
            <th>Y</th>
            <th>Z</th>
        </tr>
    </thead>
    <tbody>
    {props.intersectPoints.map((el) => {
    return(
            <tr key={el.number}  >
                <td>{el.number}</td>
                <td>{(Math.round(el.x * 100)/100).toFixed(2)}</td>
                <td>{(Math.round(el.y * 100)/100).toFixed(2)}</td>
                <td>{(Math.round(el.z * 100)/100).toFixed(2)}</td>
            </tr>
    ); 
    })}
</tbody>
</table>);
}

export default outputTable;