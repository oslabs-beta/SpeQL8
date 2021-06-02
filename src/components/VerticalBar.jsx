import React from "react";
import { Bar } from "react-chartjs-2";
import { withTheme } from "styled-components";

// const data = {
//   labels: ['Query #1', 'Query #2',],
//   datasets: [
//     {
//       label: 'Time in ms',
//       data: [12, 19, 3, 5, 2, 3],
//       backgroundColor: [
//         'rgba(255, 99, 132, 0.2)',
//         'rgba(54, 162, 235, 0.2)',
//         // 'rgba(255, 206, 86, 0.2)',
//         // 'rgba(75, 192, 192, 0.2)',
//         // 'rgba(153, 102, 255, 0.2)',
//         // 'rgba(255, 159, 64, 0.2)',
//       ],
//       borderColor: [
//         'rgba(255, 99, 132, 1)',
//         'rgba(54, 162, 235, 1)',
//         // 'rgba(255, 206, 86, 1)',
//         // 'rgba(75, 192, 192, 1)',
//         // 'rgba(153, 102, 255, 1)',
//         // 'rgba(255, 159, 64, 1)',
//       ],
//       borderWidth: 1,
//     },
//   ],
// };

// const options = {
//   tooltips: {
//     callbacks: {
//       label: function(tooltipItem, data) {
//         return [tooltipItem.yLabel + 'ms', '\n{\nfilmById(_id:3){\n  title\n  director\n  releaseDate\n  producer\n}\n}\n'];
//       },
//     }
//   },
//   scales: {
//     xAxes: [
//         {
//           ticks: {
//             beginAtZero: true,
//             fontColor: "white"
//           },
//         },
//       ],
//     yAxes: [
//       {
//         ticks: {
//           beginAtZero: true,
//           fontColor: "white"
//         },
//       },
//     ],
//   },
//   legend: {
//       labels: {
//           fontColor: "white",
//       }
//   }
// };

const VerticalBar = (props) => {
  const { testData, setTestData } = props;
  const { options, setOptions } = props;
  return <Bar data={testData} options={options}/>;
};

export default VerticalBar;
