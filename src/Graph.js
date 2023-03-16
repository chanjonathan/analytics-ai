import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

function Graph({ props } ) {
  const chartContainer = useRef(null);
  console.log(props);
  const dataState = props.dataState;
  const config = props.config;

  const colors = [];
  function generateColors() {
    for (let i = 0; i < dataState.label.length; i++) {
      colors.push('#'+Math.floor(Math.random()*16777215).toString(16));
    }
  }
  generateColors();

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const chartConfig = {
        bar: {
        type: 'bar',
        data: {
          labels: dataState.label,
          datasets: [{
            data: dataState.count,
            backgroundColor: colors,
            borderColor: 'black',
          }]
        },
        options: {
          plugins: {
            legend: {
              display: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              fontColor: 'black',
              title: {
                display: true,
                text: config['y-label']
              }
            },
            x: {
              title: {
                display: true,
                text: config['x-label']
              }
            }

          },
          responsive: true,
          maintainAspectRatio: false
        }
      },
      pie: {
        type: 'pie',
        data: {
          labels: dataState.label,
          datasets: [{
            data: dataState.count,
            backgroundColor: colors,
            borderColor: 'black',
          }]
        },
        options: {
          plugins: {
            legend: {
              display: true,
            },
          },
          responsive: true,
          maintainAspectRatio: false
        }
      }
    };
      
      const chart = new Chart(chartContainer.current, chartConfig[config['chart-type']]);
      console.log(props);
      return () => {
        chart.destroy();
      }
    }
  }, [props]);
  
  return (
    <div className="graph-container">
      <h2>{config.title}</h2>
      <canvas ref={chartContainer}></canvas>
    </div>
  );
}

export default Graph;