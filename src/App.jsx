import React, { useEffect, useState } from "react";
import GraphiQL from "graphiql";
import "graphiql/graphiql.min.css";
import "codemirror/theme/material-ocean.css";
import socketIOClient from "socket.io-client";
let ENDPOINT = "http://localhost:3333";
const regeneratorRuntime = require("regenerator-runtime");

const servicesModule = require("./modules/services");
const services = servicesModule.services;

import SchemaSelector from "./components/SchemaSelector";
import MetricsVisualizer from "./components/MetricsVisualizer";
import SchemaButtonsContainer from "./components/SchemaButtonsContainer";

/*
minified CSS is currently being pulled from the graphiql module. If we want to get more
granular, we can: https://github.com/graphql/graphiql/tree/main/packages/graphiql/src/css 

The graphiql/packages/graphiql repo has info in the readme pertaining 
to the props that GraphiQL can accept: https://github.com/graphql/graphiql/blob/main/packages/graphiql/README.md
*/

const App = () => {
  const [currentSchema, changeCurrentSchema] = useState("None Selected");
  //we probably want to give this the relevant data 'starter' object in services.js as its default state - (services[0].label) rather than hard coding this here
  const [schemaList, updateSchemaList] = useState(["SWAPI", "Users"]);
  const [fetchURL, setFetchURL] = useState(
    `http://localhost:${services[0].port}/graphql`
  );
  const [lastQuerySpeed, setLastQuerySpeed] = useState("-");
  const [lastQuery, setLastQuery] = useState("");
  const [currentPort, setCurrentPort] = useState(services[0].port);
  const [dataSet, setDataSet] = useState([]);
  const [lastHash, setLastHash] = useState("");

  useEffect(() => {
    //ALLAN'S SOCKET IO BITS
    const socket = socketIOClient(ENDPOINT);
    socket.on("FromAPI", (data) => {
      if (typeof data.totalDuration === "number") {
        setLastQuerySpeed(Math.round(data.totalDuration / 1000000));
        setLastQuery(data.clientQuery);
        setLastHash(data.hash);
      }
    });

    //this conditional is required to make sure we don't overwrite the default state of fetchURL before a schema has been selected
    // console.log("inside the userEffect which fires the setTimeout")

    // const execButton = document.getElementsByClassName('execute-button');

    // async function fetcher() {
    //   const response = await fetch(
    //     'http://localhost:4000/redis',
    //     {
    //       method: 'GET',
    //       credentials: 'same-origin',
    //     }
    //   )
    //   const responseJson = await response.json();
    //   // console.log(responseJson);
    //   const resolversArr = JSON.parse(responseJson.resolvers);
    //   console.log(resolversArr);
    //   setLastQuerySpeed(Math.round(responseJson.totalDuration / 1000000));

    //         // do not put anything above this line!! setTimeout in clicked will give you an innacurate reading for lastQuerySpeed!
    //   let queryNumber;
    //   if (dataSet.length === 0) {
    //     queryNumber = 1;
    //   } else {
    //     queryNumber = dataSet.length + 1;
    //   }
    //   setLastQuery(responseJson.clientQuery);
    //   const dataObj = {
    //     queryNumber: queryNumber,
    //     //resolver3: ....
    //     //...
    //     //resolver1: ...
    //     totalReponseTime: Math.round(responseJson.totalDuration / 1000000)
    //   }
    //   resolversArr.forEach((obj, index) => {
    //     console.log(`resolvers array at index ${index}`)
    //     console.log(obj.duration);
    //     if (!dataObj[`resolver ${index + 1}`]) {
    //       //this is going to be a dumb way to present the data because the data for the reamining resolvers is so small... they'll mostly round out to zero...
    //       dataObj[`resolver${index + 1}`] = Math.round(obj.duration / 1000000);
    //     }
    //   });
    //   setDataSet(prevState => [...prevState, dataObj]);
    // }

    // async function clicked() {
    //   console.log('inside clicked!')
    //   return setTimeout(fetcher, 500);
    //   // responseJson is the metrics object, go ahead and pass it around to the components from here! :)
    // }
    // execButton[0].addEventListener('click', clicked);
  }, []);

  useEffect(() => {
    console.log("inside the gqlApiString useEffect");
    //this conditional is required to make sure we don't overwrite the default state of fetchURL before a schema has been selected
    if (currentSchema !== "") {
      //this does not work correctly if we delete SWAPI first and then try and click Users
      let gqlApiString;
      let port;
      for (let i = 0; i < services.length; i++) {
        console.log(`LABEL for ${i} iteration: ${services[i].label}`);
        if (services[i].label === currentSchema) {
          port = services[i].port;
          gqlApiString = `http://localhost:${port}/graphql`;
          break;
        } else {
          console.log("did not find a matching label");
        }
      }
      //this conditional exists to get round a browser console error, it assumes that we'll have at least 1 object in services.js array
      // if (schemaList.length > 1) {
      setCurrentPort(port);
      setFetchURL(gqlApiString);
      // }
    }
  });

  // console.log(`timeData outside of func: ${timeData}`)
  // console.log(Array.isArray(timeData))

  function handleQuery(e) {
    e.preventDefault();
    console.log("here is the handlequery button", e);
    console.log(e.target);
    console.log(e.target.innerText);
    changeCurrentSchema(e.target.innerText);
    console.log(e.target.id);
    const allSchemaButtons = document.getElementsByClassName(
      "schema-list-element"
    );
    console.log(allSchemaButtons.length);
    for (let i = 0; i < allSchemaButtons.length; i++) {
      console.log(allSchemaButtons[i].children[0]);
      allSchemaButtons[i].children[0].classList.remove(
        "schema-button-selected"
      );
    }
    // allSchemaButtons.forEach((button) => button.classList.remove('selected-button'));
    e.target.classList.add("schema-button-selected");
  }

  // let queryNumber = 3;
  // const [testDataArray, setTestDataArray] = useState([12,19])

  const data = {
    labels: [],
    datasets: [
      {
        label: "Time in ms",
        data: [],
        queries: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const queriesForBars = ["hey!"];

  const defaultOptions = {
    tooltips: {
      callbacks: {
        afterLabel: function (tooltipItem, data) {
          return data.datasets[0].queries[tooltipItem.index];
        },
      },
    },
    scales: {
      xAxes: [
        {
          ticks: {
            beginAtZero: true,
            fontColor: "white",
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            fontColor: "white",
          },
        },
      ],
    },
    legend: {
      labels: {
        fontColor: "white",
      },
    },
  };

  const [testData, setTestData] = useState(data);
  const [queryNumber, setQueryNumber] = useState(1);
  const [options, setOptions] = useState(defaultOptions);

  // useEffect(()=> {
  //   setTestDataArray([...testDataArray, lastQuerySpeed])
  // }, [testData]);

  const handleSaveClick = () => {
    const copy = [...testData.datasets];
    copy[0].data = [...copy[0].data, lastQuerySpeed];
    copy[0].queries = [...copy[0].queries, lastQuery];

    setTestData((prevState) =>
      // {...prevState, labels: [...prevState.labels, `Query #${queryNumber}`], datasets: copy}
      ({
        ...prevState,
        labels: [
          ...prevState.labels,
          `Query #${queryNumber}: ${currentSchema}`,
        ],
        datasets: copy,
      })
    );
    setQueryNumber(queryNumber + 1);

    //delete if this works
    //  setDataSet([...dataSet,
    //   {distance:lastQuerySpeed,
    //    colors:[
    //     "#fd1d1d",
    //     "#833ab4"],
    //     query: lastQuery,
    //   }
    //   ])
    // setTestData([...testData,
    // {
    //   queryNumber: 4,
    //       'dogs': 3,
    //       'cats': 7,
    //       'pets': lastQuerySpeed,
    // }])
    console.log("testing for handleSaveClick");
  };

  const handleCacheClick = async () => {
    console.log("fetching from redis");
    const response = await fetch(`http://localhost:4000/redis/${lastHash}`, {
      method: "GET",
      credentials: "same-origin",
    });
    const responseJson = await response.json();
    console.log(responseJson);
  };

  return (
    //this outermost div MUST have the id of 'graphiql' in order for graphiql to render properly
    //the defaultQuery prop currently relates to the default 'Users' DB - not currently working as intended
    <div id="graphiql" className="main-container">
      <SchemaSelector
        currentSchema={currentSchema}
        changeCurrentSchema={changeCurrentSchema}
        handleQuery={handleQuery}
        schemaList={schemaList}
        updateSchemaList={updateSchemaList}
        fetchURL={fetchURL}
        setFetchURL={setFetchURL}
        currentPort={currentPort}
        setCurrentPort={setCurrentPort}
      />
      <SchemaButtonsContainer
        schemaList={schemaList}
        handleQuery={handleQuery}
      />
      <MetricsVisualizer
        lastQuerySpeed={lastQuerySpeed}
        dataSet={dataSet}
        setDataSet={setDataSet}
        handleSaveClick={handleSaveClick}
        handleCacheClick={handleCacheClick}
        testData={testData}
        setTestData={setTestData}
        options={options}
      />
      <GraphiQL
        clasName="graphiql"
        editorTheme="material-ocean"
        // defaultQuery="# Here's a sample query to get you started: \n\n{userById(id:1){\nusername\npassword\n}\n}"
        //this defaultQuery is not as easy as anticipated... see: https://github.com/graphql/graphiql/blob/fedbc6130939c1e34b29d23257aed7e858bfca0b/src/components/GraphiQL.js#L903-L931
        fetcher={async (graphQLParams) => {
          const data = await fetch(fetchURL, {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify(graphQLParams),
            credentials: "same-origin",
          });
          return data.json().catch(() => data.text());
        }}
      />
    </div>
  );
};

export default App;
