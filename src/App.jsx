import React, { useEffect, useState, useRef } from "react";
import { MdOutlineDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { FiPlus } from "react-icons/fi";
import Create from "./components/Create";
import Delete from "./components/Delete";
import Update from "./components/Update";

function App() {

  const [singleClassData, setSingleClassData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [addNewModal, setAddNewModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [id, setId] = useState();
  const [className, setClassName] = useState();
  const [departmentName, setDepartmentName] = useState();
  const tableRef = useRef();
  const navBarRef = useRef();
  const [singleDepartment, setSingleDepartment] = useState();

  async function getAllData() {
    const response = await fetch("http://localhost:5000");
    const jsonData = await response.json();
    setAllData(jsonData);
  }

  useEffect(() => {
    getAllData();
  }, []);

  async function handleDelete(id) {
    setDeleteModal(true);
    const response = await fetch(`http://localhost:5000/classes/${id}`, {
      method: "GET",
    });
    const jsonData = await response.json();
    setSingleClassData(jsonData);
  }

  async function handleUpdate(id) {
    console.log(id);
    const response = await fetch(`http://localhost:5000/classes/${id}`, {
      method: "GET",
    });
    const jsonData = await response.json();

    const departmenntResponse = await fetch(
      `http://localhost:5000/departments/${jsonData[0].department_id}`
    );

    const departmentJson = await departmenntResponse.json();
    setSingleDepartment(departmentJson[0]);
    setId(id);
    setClassName(jsonData[0].name);
    setDepartmentName(jsonData[0].department_id);
    setSingleClassData(jsonData);
    setUpdateModal(true);
    console.log(departmentJson);
  }

 
  const handleScroll = () => {
    const navBar = navBarRef.current;
    const header = tableRef.current && tableRef.current.querySelector("thead");

    if (header && navBar) {
      const { scrollTop } = document.documentElement;
      const navBarHeight = navBar.offsetHeight;

      if (scrollTop > navBarHeight) {
        navBar.style.backgroundColor = "rgba(51, 51, 51, 0.8)"; 
        navBar.style.backdropFilter = "blur(5px)"; 
        navBar.style.color = "rgb(203 213 225)";
        navBar.style.fonts="font-poppins";
        header.style.color="rgb(255 255 255)";
        header.style.backgroundColor = "rgba(0, 0, 0, 0.8)"; 
        header.style.position = "sticky";
        header.style.top = `${navBarHeight}px`;
        header.querySelectorAll("th").forEach(th => {
          th.style.color = "rgb(203 213 225)"; 
        });
      } else {
        navBar.style.backgroundColor = "#333333"; 
        navBar.style.backdropFilter = "none"; 
        navBar.style.color = "#FFFFFF"; 
        header.style.position = "static";
        header.querySelectorAll("th").forEach(th => {
          th.style.color = "rgb(255 255 255)"; 
      
        });
      }
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      {deleteModal && (
        <Delete
          singleClassData={singleClassData}
          getAllData={getAllData}
          setDeleteModal={setDeleteModal}
        />
      )}
      {addNewModal && <Create setAddNewModal={setAddNewModal} />}
      {updateModal && (<Update setUpdateModal={setUpdateModal} id={id} classMainName={className}   {...singleDepartment} />)}
    
      <nav
        ref={navBarRef}
        className="nav-bar bg-gray-800 p-4 flex justify-between items-center fixed top-1 right-16 w-4/5 h-18 z-50 text-white shadow-md transition-colors duration-300"
      >
        <div className="text-xl font-bold">Class List</div>
        <button
          className="flex items-center bg-blue-500 px-4 py-2 rounded-md text-lg hover:bg-blue-600 transition-colors duration-300"
          onClick={() => setAddNewModal(true)}
        >
          <FiPlus className="mr-2" />
          New
        </button>
      </nav>

      <div className="flex justify-center items-center mt-20 mb-8">
        <div className="overflow-x-auto w-full sm:w-3/4 lg:w-2/3 xl:w-1/2">
          <table
            className=" bg-white rounded-lg shadow-lg absolute right-16 ml-10 w-4/5"
            ref={tableRef}
            
          >
            <thead className=" bg-gray-200 sticky top-0 z-40">
              <tr>
                <th className="px-6 py-3 text-lg font-medium text-gray-700 uppercase tracking-wider text-center">
                  ID
                </th>
                <th className="px-6 py-3 text-lg font-medium text-gray-700 uppercase tracking-wider text-center">
                  Class
                </th>
                <th className="px-6 py-3 text-lg font-medium text-gray-700 uppercase tracking-wider text-center">
                  Department
                </th>
                <th className="px-6 py-3 text-lg font-medium text-gray-700 uppercase tracking-wider text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {allData.map((item) => (
                <tr key={item.class_id}>
                  <td className="px-6 py-4 text-lg text-center">{item.class_id}</td>
                  <td className="px-6 py-4 text-lg text-center">{item.class_name}</td>
                  <td className="px-6 py-4 text-lg text-center">{item.department_name}</td>
                  <td className="px-6 py-4 text-lg text-center flex justify-center">
                    <button
                      className="text-blue-500 hover:text-blue-900 text-xl mr-4"
                      onClick={() => handleUpdate(item.class_id)}
                    >
                      <CiEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-800 text-xl"
                      onClick={() => handleDelete(item.class_id)}
                    >
                      <MdOutlineDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default App;
