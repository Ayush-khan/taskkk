import { useRef } from "react";
import { MdOutlineDeleteSweep } from "react-icons/md";

function Delete({ singleClassData, getAllData, setDeleteModal }) {
  const parent = useRef();

  function handleParentClick(e) {
    if (e.target === parent.current) {
      setDeleteModal(false);
    }
  }

  async function handleConfirmClick() {
    const classId = singleClassData[0]?.class_id;
    if (classId) {
      await fetch(`http://localhost:5000/classes/${classId}`, {
        method: "DELETE",
      });
      setDeleteModal(false);
      getAllData();
    }
  }

  const className = singleClassData[0]?.name || '';
  const isLongName = className.length > 20; // Adjust the threshold as needed

  return (
    <div
      className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-500 bg-opacity-50 z-50 transition-all duration-500"
      onClick={handleParentClick}
      ref={parent}
    >
      <div className="w-11/12 sm:w-3/4 md:w-1/2 lg:w-1/3 xl:w-1/4 bg-white border rounded-lg shadow-lg p-4 flex flex-col items-center justify-between overflow-hidden">
        <MdOutlineDeleteSweep className="text-red-500 text-9xl" />

        <h1 className="text-xl text-center w-full">
          Are you deleting
          <span
            className={`text-xl font-bold ${isLongName ? 'max-w-[10rem] truncate' : ''}`}
          >
            {" "}{ className} {" "}
          </span>
          class?
        </h1>

        <div className="flex flex-col sm:flex-row items-center justify-center w-full mt-4">
          <button
            className="bg-gray-500 text-white w-full sm:w-28 h-10 rounded-md mb-2 sm:mb-0 sm:mr-2"
            onClick={() => setDeleteModal(false)}
          >
            Cancel
          </button>
          <button
            className="bg-red-500 text-white w-full sm:w-28 h-10 rounded-md"
            onClick={handleConfirmClick}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default Delete;
