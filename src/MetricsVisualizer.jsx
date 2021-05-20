import React, { useState } from 'react';
import ColumnChart from './ColumnChart';

const MetricsVisualizer = (props) => {

    const { lastQuerySpeed } = props;
    
    const [dataSet, setDataSet] = useState([])

    const handleClick = () => {
      setDataSet([...dataSet, 
        {"distance":lastQuerySpeed,
       "colors":[
          "#fd1d1d",
          "#833ab4"]}
        ])
    }

  //within state, ignore the first element within TimeData (although this will have to live up a level if it's being set by the graphiQL play button)
    return (
      <div>
      <div className='query-speed-box'>
          <button onClick={handleClick}>Save As Comparison</button>
          <h4>Query Response Time</h4>
          <p>{lastQuerySpeed}<span className='milliseconds-display'>ms</span></p>
      </div>
      <ColumnChart dataSet={dataSet} />
      </div>
    )
}

export default MetricsVisualizer;