import React from "react";
import VerticalBar from "./VerticalBar";

const MetricsVisualizer = (props) => {
  const { lastQuerySpeed } = props;
  const { handleSaveClick } = props;
  const { handleCacheClick } = props;
  const { testData } = props;
  const { options } = props;

  return (
    <div>
      <div className="query-speed-box">
        <button onClick={handleSaveClick}>Save As Comparison</button>
        <button onClick={handleCacheClick}>Run Query From Cache</button>
        <h4>Query Response Time</h4>
        <p>
          {lastQuerySpeed}
          <span className="milliseconds-display">ms</span>
        </p>
      </div>
      <div className="vertical-bar">
        <VerticalBar testData={testData} options={options} />
      </div>
    </div>
  );
};

export default MetricsVisualizer;
