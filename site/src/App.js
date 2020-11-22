import React from 'react';
//import styles from './App.module.css';
import {Line, Bar} from 'react-chartjs-2';
import axios from 'axios';
class App extends React.Component {
  state = {
    Names: [],
    Counter: [],
  }
  
  async componentDidMount(){

    const axios = require('axios');

    axios.get('https://us-central1-codechella-b0537.cloudfunctions.net/api/PlantNames').then(resp => {
      console.log(resp.data);
       this.setState({Names: resp.data});
    });
  }
  

  render(){
    

    const {Names} = this.state;
    return(
      
      this.state.Names.map((skill) => {
        return (
          
          <Bar
            data = {{
                labels: [skill.name],
                datasets: [{
                    lable: 'Whatever',
                    backgroundColor:[
                        'rgba(0,0,255,0.5)',
                        'rgba(0,255,0,0.5)',
                        'rgba(255,0,0,0.5)',
                        'rgba(0,0,255,0.5)',
                        'rgba(0,255,0,0.5)',
                        'rgba(255,0,0,0.5)',
                        'rgba(0,0,255,0.5)',
                    ],
                    borderColor: 'rgba(255,99,132,1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(255,99,132,0.4)',
                    hoverBorderColor: 'rgba(255,99,132,1)',
                    data:[ skill.counter],
                    
                }]
            }}
          
            />
        );
      })

          
     
    )
  }
}

export default App;
