import { useEffect, useState } from "react";
import {
  addCustomerAPI,
  getCustomersAPI,
  deleteCustomerAPI,
} from "../services/allAPI";

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [discount, setDiscount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const fetchCustomers = async () => {
    try {
      const res = await getCustomersAPI();
      setCustomers(res.data.data);
    } catch (err) {
      setError("Failed to load customers");
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);


  const handleAddCustomer = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !phone || discount === "") {
      return setError("All fields are required");
    }

    if (phone.length < 10) {
      return setError("Enter valid phone number");
    }

    if (discount < 0 || discount > 100) {
      return setError("Discount must be between 0 and 100");
    }
try {
  setLoading(true);

  await addCustomerAPI({
    name,
    phone,
    discount: Number(discount),
  });

  setName("");
  setPhone("");
  setDiscount("");
  fetchCustomers();

 
  setError("Customer added successfully");

  setTimeout(() => setError(""), 3000);

} catch (err) {
  const msg =
    err?.response?.data?.message || "Failed to add customer";


  alert(msg);

  setError(msg);
} finally {
  setLoading(false);
}
  };

  
  const handleDelete = async (id) => {
    try {
      await deleteCustomerAPI(id);
      fetchCustomers();
    } catch (err) {
      setError("Failed to delete customer");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-2xl p-6">

   
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Customer Management
        </h2>

           {error && (
          <p className="text-red-500 mb-3 text-sm">{error}</p>
        )}

        <form
          onSubmit={handleAddCustomer}
          className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-6"
        >
          <input
            type="text"
            placeholder="Customer Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
          />

          <input
            type="number"
            placeholder="Discount (%)"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            className="border p-2 rounded-md focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </form>

    
        <div className="overflow-x-auto">
          <table className="w-full text-center border">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Discount (%)</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(customers) && customers.length > 0 ? (
                customers.map((c, index) => (
                  <tr
                    key={c._id}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{c.name}</td>
                    <td className="p-2">{c.phone}</td>
                    <td className="p-2 font-medium">
                      {c.discount}%
                    </td>
                    <td className="p-2">
                      <button
                        onClick={() => handleDelete(c._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-gray-500">
                    No customers found
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

export default Customers;