import React from "react";
import { __DATA__ } from "./data.js";
const vizData = require('./datatest');
import {
  MainContainer,
  Container,
  BarChartContainer,
  Number,
  BlackLine,
  MakeBar
} from "./styles";


//Use hooks here instead of the imported dataset



// export default function ColumnChart() {
//   return (
//     <Container className='column-chart'>
//       <MainContainer>
//         {vizData.map(({ distance, colors }, i) => {
//           return (
//             <BarChartContainer key={i}>
//               <Number color={colors[1]}>{distance} ms</Number>
//               <MakeBar height={distance * 2} colors={colors} />
//             </BarChartContainer>
//           );
//         })}
//       </MainContainer>
//       <BlackLine />
//     </Container>
//   );
// }

const ColumnChart = (props) => {

  const { dataSet } = props;

  return (
    <Container className='column-chart'>
      <MainContainer>
        {dataSet.map(({ distance, colors }, i) => {
          return (
            <BarChartContainer key={i}>
              <Number color={colors[1]}>{distance} ms</Number>
              <MakeBar height={distance * 2} colors={colors} />
            </BarChartContainer>
          );
        })}
      </MainContainer>
      <BlackLine />
    </Container>
  );
}
export default ColumnChart;