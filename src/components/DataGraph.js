import "./DataGraph.css";

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: {
        display: false,
    },
    title: {
      display: false,
      text: '',
    },
    tooltip: {
      enabled: false
    }
  },
  scales: {
    y:{
        beginAtZero: true,
        ticks:{
            display: false
        },
        grid:{
            drawTicks:false,
            // display: false,
            drawBorder: false
        }
    },
    x: {
      grid:{
        // display: false
        drawTicks: false
      },
      ticks:{
        font:{
          size: 15
        }
      }
    },
  }
};

const DataGraph = (props) => {

  // extracting informaiton from props
  const labels = props.options;
  const votes = props.votes;
  const answered = props.answered;
  const choosenIndex = props.choosenIndex;
  const totalVotes = Object.values(votes).reduce((prev, curr) => prev + curr, 0);

  const data = {
    labels,
    datasets: [
      {
        label: 'Dataset 1',
        data: convertDataIntoPercentage(totalVotes, votes),
        // making sure after vote is chossen it's hilighted
        backgroundColor: color => {
          let colors = (answered && color.index === choosenIndex) ? 'rgba(51,51,51,0.9)' : 'rgba(190,190,190, 0.5)';
          return colors;
        },
        borderRadius: 8
      }
    ]
  };

  // empty data that is shown until user chooses vote
  const emptyData = {
    labels,
    datasets: [
      {
        labels: "empty dataset",
        data: Array(Object.values(votes).length).fill(0),
        borderRadius: 8
      }
    ],
    
  }

  return(
    <div className="chart-container">
      <Bar options={options} data={answered ? data :emptyData}/>
    </div>
  );
}

// converting vote tallies into percentages
function convertDataIntoPercentage(totalVotes, votesArr){
  let percentageArray = Object.values(votesArr).map((currentVote) => {
    return currentVote/totalVotes;
  });
  return percentageArray;
}

export default DataGraph;