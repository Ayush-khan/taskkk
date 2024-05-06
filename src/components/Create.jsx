import { useEffect, useRef, useState } from "react";

function Create({ setAddNewModal }) {
  const [className, setClassName] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [departmentData, setDepartmentData] = useState([]);
  const [nameError, setNameError] = useState(""); 
  const parent = useRef();

  const handleClassNameChange = (e) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setClassName(value);
      setNameError(""); 
    } else {
      setNameError("Name must not exceed 50 characters."); 
    }
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  async function getDepartmentData() {
    try {
      const response = await fetch("http://localhost:5000/departments");
      const jsonData = await response.json();
      setDepartmentData(jsonData);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  }

  useEffect(() => {
    getDepartmentData();
  }, []);

  const handleParentClick = (e) => {
    if (e.target === parent.current) setAddNewModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (nameError) {
      return; 
    }

    try {
      await fetch("http://localhost:5000/classes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: className,
          department_id: selectedDepartment,
        }),
      });
      window.location.replace("http://localhost:5173");
    } catch (error) {
      console.error("Error creating class:", error);
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center fixed top-0 left-0 z-30 bg-opacity-50 bg-gray-500 transition-all duration-500" onClick={handleParentClick} ref={parent}>
      <div className="w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white shadow-lg p-8">
        <h2 className="text-xl font-semibold mb-4">Create a New Class</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="className" className="block text-sm font-medium text-gray-700">Name:</label>
            <input type="text" id="className" value={className} onChange={handleClassNameChange} className="mt-1 p-2 block w-full rounded-md border border-gray-300" required />
            {nameError && <p className="text-red-500 text-sm mt-1">{nameError}</p>} {/* Display error message */}
          </div>
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">Department:</label>
            <select id="department" value={selectedDepartment} onChange={handleDepartmentChange} className="mt-1 p-2 block w-full rounded-md border border-gray-300" required>
              <option value="">Select Department</option>
              {departmentData.map((department) => (
                <option key={department.department_id} value={department.department_id}>{department.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 w-full">Create Class</button>
        </form>
      </div>
    </div>
  );
}

export default Create;
