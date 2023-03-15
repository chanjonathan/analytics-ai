import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

function Graph({ props } ) {
  const chartContainer = useRef(null);
  
  console.log(props);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const chartConfig = {
        type: 'bar',
        data: {
          labels: props.label,
          datasets: [{
            label: 'Sales',
            data: props.count,
            backgroundColor: 'rgb(61,56,53)',
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
            }
          },
          responsive: true,
          maintainAspectRatio: false
        }
      };
      
      const chart = new Chart(chartContainer.current, chartConfig);
      console.log(props);
      return () => {
        chart.destroy();
      }
    }
  }, [props]);
  
  return (
    <div className="graph-container">
      <h2>Insert Title Here</h2>
      <canvas ref={chartContainer}></canvas>
    </div>
  );
}

export default Graph;