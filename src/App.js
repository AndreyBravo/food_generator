import "./App.css";
import { useState, useEffect, useMemo } from "react";
import Papa from "papaparse";
import Data from "./data.csv";

function App() {
  const [data, setData] = useState([]);
  const [text, setText] = useState("Густой молочно-клубничный коктейль");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(Data);
      const reader = response.body.getReader();
      const result = await reader.read();
      const decoder = new TextDecoder("utf-8");
      const csvData = decoder.decode(result.value);
      const parseData = Papa.parse(csvData, {
        header: true,
        skipEmptyLines: true,
      }).data;
      setData(parseData);
    };
    fetchData();
  }, []);

  const filterArr = useMemo(() => {
    return data.filter((item) => item.name == text);
  });

  const handleText = (e) => {
    setText(e.target.value);
  };

  function ingredient(item) {
    const newItem = item.replaceAll("'", '"');
    const arr = JSON.parse(newItem);
    return Object.entries(arr);
  }

  return (
    <div className="App">
      {/* <input type="file" accept=".csv" onChange={handleFileUpload} /> */}

      {/* <button onClick={handleClick}>click</button> */}

      <input
        className="inputText"
        type="text"
        placeholder="text..."
        onChange={handleText}
      />

      {data.length ? (
        <table className="tableReciept">
          <thead>
            <tr>
              {/* <th>url</th> */}
              <th>name</th>
              <th>ingredients</th>
            </tr>
          </thead>
          <tbody>
            {filterArr.map((item, index) => (
              <tr key={index}>
                {/* <td><img src={item.url}/></td> */}
                <td>{item.name}</td>
                <td>
                  <ul>
                    {ingredient(item.ingredients).map((elem) => (
                      <li key={elem[0]}>
                        {elem[0]}: {elem[1]}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  );
}

export default App;
