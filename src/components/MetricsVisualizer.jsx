import React, { useState } from 'react';
import ColumnChart from './ColumnChart';
import StyledBarChart from './StyledBarChart';

const MetricsVisualizer = (props) => {

    const { lastQuerySpeed } = props;
    const {dataSet, setDataSet } = props;
    const { handleSaveClick } = props;
    const { handleCacheClick } = props;

    const { testData, setTestData } = props;


  //within state, ignore the first element within TimeData (although this will have to live up a level if it's being set by the graphiQL play button)
    return (
      <div>
      <div className='query-speed-box'>
          <button onClick={handleSaveClick}>Save As Comparison</button>
          <button onClick={handleCacheClick}>Run Query From Cache</button>
          <h4>Query Response Time</h4>
          <p>{lastQuerySpeed}<span className='milliseconds-display'>ms</span></p>
      </div>
      {/* <ColumnChart dataSet={dataSet} /> */}
      <StyledBarChart testData={testData} setTestData={setTestData} />
      </div>
    )
}

export default MetricsVisualizer;