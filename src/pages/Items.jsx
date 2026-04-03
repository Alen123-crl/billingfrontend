import { useEffect, useState } from "react";
import {
  addItemAPI,
  getItemsAPI,
  deleteItemAPI,
} from "../services/allAPI";

function Items() {
  const [items, setItems] = useState([]); 
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const fetchItems = async () => {
    try {
      const res = await getItemsAPI();

      console.log("API RESPONSE:", res);
      
      const data =
        res?.data?.data || res?.data || [];

      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.log(err);
      setError("Failed to load items");
      setItems([]); 
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

 
  const handleAddItem = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !price) {
      return setError("All fields are required");
    }

    try {
      setLoading(true);

      await addItemAPI({
        name,
        price: Number(price),
      });

      setName("");
      setPrice("");

      fetchItems(); 
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Failed to add item";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

 
  const handleDelete = async (id) => {
    try {
      await deleteItemAPI(id);
      fetchItems();
    } catch (err) {
      setError("Failed to delete item");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6">

        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Items Management
        </h2>

     
        {error && (
          <p className="text-red-500 mb-3 text-sm">{error}</p>
        )}

     
        <form
          onSubmit={handleAddItem}
          className="flex flex-col md:flex-row gap-3 mb-6"
        >
          <input
            type="text"
            placeholder="Item Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="w-full text-center border">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Item Name</th>
                <th className="p-3">Price (₹)</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {items?.length > 0 ? (   
                items.map((item, index) => (
                  <tr
                    key={item._id || index}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2 font-medium">
                      Rs:{item.price}
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-4 text-gray-500">
                    No items found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Items;