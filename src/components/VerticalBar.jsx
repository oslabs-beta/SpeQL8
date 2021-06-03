import React from "react";
import { Bar } from "react-chartjs-2";
import { withTheme } from "styled-components";

const VerticalBar = (props) => {
  const { testData, setTestData } = props;
  const { options, setOptions } = props;
  return <Bar data={testData} options={options} />;
};

export default VerticalBar;
