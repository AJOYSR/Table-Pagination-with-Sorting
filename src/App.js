import "./App.css";
import "./bootstrap.css";
import { useState, useEffect } from "react";
const PER_PAGE_ITEMS = 10;
function App() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [sortBy, setSortBy] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    fetch("https://api.publicapis.org/entries")
      .then((res) => res.json())
      .then((data) => setData(data.entries.slice(0, 50)));
  }, []);
  function slicedTenData() {
    // const startIndex = (currentPage - 1) * PER_PAGE_ITEMS;
    // const endIndex = startIndex + PER_PAGE_ITEMS;
    // console.log(data.length);
    // return data.slice(startIndex, endIndex);
    let sortedData = data;
    if (sortBy) {
      sortedData = data.sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (aValue < bValue) {
          return sortOrder === "asc" ? -1 : 1;
        } else if (aValue > bValue) {
          return sortOrder === "asc" ? 1 : -1;
        } else {
          return 0;
        }
      });
    }
    const startIndex = (currentPage - 1) * PER_PAGE_ITEMS;
    const endIndex = startIndex + PER_PAGE_ITEMS;
    return sortedData.slice(startIndex, endIndex);
  }

  function handlePageChange(pageNumber) {
    setCurrentPage(pageNumber);
  }

  function handleSort(columnName) {
    if (sortBy === columnName) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(columnName);
      setSortOrder("asc");
    }
  }
  const newData = slicedTenData();

  return (
    <div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th onClick={() => handleSort("API")}>
              API {sortBy === "API" && sortOrder === "asc" && "(..▲..)"}
              {sortBy === "API" && sortOrder === "desc" && "(..▼..)"}
            </th>
            <th onClick={() => handleSort("Category")}>
              Category {sortBy === "Category" && sortOrder === "asc" && "(..▲..)"}
              {sortBy === "Category" && sortOrder === "desc" && "(..▼..)"}
            </th>
            <th onClick={() => handleSort("Description")}>
              Description {sortBy === "Description" && sortOrder === "asc" && "(..▲..)"}
              {sortBy === "Description" && sortOrder === "desc" && "(..▼..)"}
            </th>
          </tr>
        </thead>
        <tbody>
          {newData.map((item, index) => (
            <tr key={index}>
              <td>{item.API}</td>
              <td>{item.Category}</td>
              <td>{item.Description}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="btn btn-warning"
        >
          Prev
        </button>
        <span className="current-page">Page {currentPage}</span>
        <button
          disabled={currentPage === Math.ceil(data.length / PER_PAGE_ITEMS)}
          onClick={() => handlePageChange(currentPage + 1)}
          className="btn btn-primary"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default App;
