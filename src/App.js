import React, {
  Component
} from 'react';
import './App.css';
import Layout from './Components/Layout';
import Panel from './Components/Panel';
import * as Papa from "papaparse";
import Calculations from './Components/Calculations/Calculations';
import M from 'materialize-css'; // It installs the JS asset only
import 'materialize-css/dist/css/materialize.min.css';




class App extends Component {

  state = {
    file: {
      points: null,
      angles: null
    },
    data: {
      coordinate: [],
      direction: []
    }
  }


  uploadTestData = () => {
    const testData = {
      coordinate: [{
          number: 'A',
          y: 5548680.39,
          x: 7407993.59,
          z: 210.00
        },
        {
          number: 'B',
          y: 5548788.17,
          x: 7408039.53,
          z: 230.00
        },
        {
          number: 'C',
          y: 5548717.21,
          x: 7408114.36,
          z: 240.00
        }
      ],

      direction: [
        {
          number: 'B',
          h: 0,
          v: 10.7635
        },
        {
          number: '1',
          h: 7.8445,
          v: 10.3000
        },
        {
          number: '2',
          h: 19.6851,
          v: 10.7038
        },
        {
          number: '3',
          h: 27.6755,
          v: 11.3113
        },
        {
          number: '4',
          h: 37.4874,
          v: 12.6043
        },
        {
          number: '5',
          h: 46.6664,
          v: 13.7906
        },
        {
          number: 'C',
          h: 55.5101,
          v: 14.8506
        }
      ]
    }

    this.setState({data: testData});

  }




  handleselectedFile = (event) => {
    let fileType = event.target.name;
    let file = event.target.files[0];

    const config = {
      delimiter: ",", // auto-detect
      newline: "", // auto-detect
      quoteChar: '"',
      escapeChar: '"',
      header: false,
      transformHeader: undefined,
      dynamicTyping: false,
      preview: 0,
      encoding: "",
      worker: false,
      comments: false,
      step: undefined,
      complete: (results) => {
        console.log("Parsing complete:", results, fileType);

        const newState = {
          ...this.state
        };

        if (fileType === 'pointsImport') {
          newState.file.points = results.data;
        }
        if (fileType === 'anglesImport') {
          newState.file.angles = results.data;
        }
        this.setState({
          file: newState.file
        });
      },
      error: undefined,
      download: false,
      skipEmptyLines: false,
      chunk: undefined,
      fastMode: undefined,
      beforeFirstChunk: undefined,
      withCredentials: undefined,
      transform: undefined,
      delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
    };

    (event.target.files.length !== 0) ? Papa.parse(file, config): this.setState({
      file: {
        points: null,
        angles: null
      }
    });;

  }



  handleProcessData = () => {


    let newState = {
      ...this.state
    };
    newState.data = {
      coordinate: [],
      direction: []
    }

    if (this.state.file.points) {
      this.state.file.points.map((row) => {
        let point = {};
        if (row.length > 1) {
          point.number = String(row[0]);
          point.x = Number(row[1]);
          point.y = Number(row[2]);
          point.z = Number(row[3]);
          newState.data.coordinate.push(point);
          return newState;
        }
      })
    } else {
      M.toast({html: 'Wczytaj współrzędne!'});
    };

    if (this.state.file.angles) {
      this.state.file.angles.map((row) => {
        let point = {};
        if (row.length > 1) {
          point.number = String(row[0]);
          point.h = Number(row[1]);
          point.v = Number(row[2]);
          point.isChecked = false;
          newState.data.direction.push(point);
        }
        return newState;
      })
    } else {
      M.toast({html: 'Wczytaj kąty!'})
    };

    if (this.state.file.points && this.state.file.angles) {
      this.setState({
        data: newState.data
      });
      //graph(newState.data);
    }
    console.log(newState);

  };




  render() {

    return (
      <div className="container App">

      <Layout>
          <h1>Pomiar zwisów lin WN</h1>
          <h5>ver. alfa</h5>
          <Panel 
            handleselectedFile={this.handleselectedFile} 
            handleProcessData= {this.handleProcessData}
            uploadTestData = {this.uploadTestData}
            />

            {(this.state.data.coordinate.length > 0)? <Calculations processing = {(data)=>this.handleCalculate(data)} data= {this.state.data}/>  : null}
            
      </Layout>

      </div>
    );
  }
}

export default App;
