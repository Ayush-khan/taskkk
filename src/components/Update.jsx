import { useEffect, useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";

function Update({ setUpdateModal, id, classMainName, name }) {
  const [className, setClassName] = useState(classMainName);
  const [selectedDepartment, setSelectedDepartment] = useState(name);
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
    const newValue = e.target.value;
    setSelectedDepartment(newValue);
  };

  async function getDepartmentData() {
    const response = await fetch("http://localhost:5000/departments");
    const jsonData = await response.json();
    setDepartmentData(jsonData);
  }

  useEffect(() => {
    getDepartmentData();
  }, []);

  const handleParentClick = (e) => {
    if (e.target === parent.current) setUpdateModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:5000/classes/${id}`, {
        method: "PUT",
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
      console.log(error);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-50"
      onClick={handleParentClick}
      ref={parent}
    >
      <div className="bg-white rounded-lg overflow-hidden w-full sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 shadow-lg">
        <IoCloseSharp
          className="float-right my-2 mx-2 text-xl text-red-500 cursor-pointer"
          onClick={() => setUpdateModal(false)}
        />
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Update Class</h2>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="className"
                className="block text-sm font-medium text-gray-700"
              >
                Class Name:
              </label>
              <input
                defaultValue={className}
                type="text"
                id="className"
                onChange={handleClassNameChange}
                className="mt-1 p-2 w-full rounded-md border border-gray-300"
                required
              />
              {nameError && (
                <p className="text-red-500 text-sm mt-1">{nameError}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700"
              >
                Department:
                <p className="text-sm text-gray-500">Previous value: {name}</p>

              </label>
              <select
    defaultValue={selectedDepartment} // Set the default value here
    id="department"
    onChange={handleDepartmentChange}
    className="mt-1 p-2 w-full rounded-md border border-gray-300"
    required
  >
    <option value="">Select</option> {/* Default option */}
    {departmentData.map((department) => (
      <option
        key={department.department_id}
        value={department.department_id}
      >
        {department.name}
      </option>
    ))}
  </select>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={handleSubmit}
              >
                Update Data
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Update;
