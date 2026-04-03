import { useEffect, useState } from "react";
import {
  getCustomersAPI,
  getItemsAPI,
  createInvoiceAPI,
} from "../services/allAPI";
import { useNavigate } from "react-router-dom";

function CreateInvoice() {
  const [customers, setCustomers] = useState([]);
  const [itemsList, setItemsList] = useState([]);
  const [rows, setRows] = useState([
    { item: "", quantity: 1, price: 0, total: 0 },
  ]);

  const [customer, setCustomer] = useState("");
  const [discount, setDiscount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCustomers();
    fetchItems();
  }, []);

  const fetchCustomers = async () => {
    const res = await getCustomersAPI();
    setCustomers(res.data.data);
  };

  const fetchItems = async () => {
    const res = await getItemsAPI();
    setItemsList(res.data.data);
  };

  const handleChange = (i, field, value) => {
    const updated = [...rows];

    if (field === "item") {
      const selected = itemsList.find((it) => it._id === value);
      updated[i].item = value;
      updated[i].price = selected?.price || 0;
    } else {
      updated[i][field] = value;
    }

    updated[i].total = updated[i].quantity * updated[i].price;
    setRows(updated);
  };

  const handleCustomerChange = (id) => {
    setCustomer(id);
    const selected = customers.find((c) => c._id === id);
    setDiscount(selected?.discount || 0);
  };

  const addRow = () => {
    setRows([...rows, { item: "", quantity: 1, price: 0, total: 0 }]);
  };

  const removeRow = (i) => {
    setRows(rows.filter((_, index) => index !== i));
  };

  const subtotal = rows.reduce((sum, r) => sum + r.total, 0);
  const discountAmount = (subtotal * discount) / 100;
  const grandTotal = subtotal - discountAmount;

  const handleSubmit = async () => {
    if (!customer) return alert("Select customer");

    try {
      const res = await createInvoiceAPI({
        customer,
        items: rows.map((r) => ({
          item: r.item,
          quantity: r.quantity,
          price: r.price,
        })),
      });

      alert(`Invoice Created! ₹${res.data.data.total}`);
      navigate("/invoices");
    } catch (err) {
      alert(err?.response?.data?.message || "Error");
    }
  };

 return (
  <div className="min-h-screen bg-gray-50 py-8 px-4">
    <div className="max-w-5xl mx-auto space-y-6">

      <div>
        <h2 className="text-2xl font-semibold text-gray-800">
          Create Invoice
        </h2>
        <p className="text-sm text-gray-500">
          Add items and generate bill easily
        </p>
      </div>


      <div className="bg-white p-5 rounded-lg shadow-sm">
        <label className="block text-sm text-gray-600 mb-1">
          Select Customer
        </label>

        <select
          className="w-full border rounded-md p-2 focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={customer}
          onChange={(e) => handleCustomerChange(e.target.value)}
        >
          <option value="">Choose customer</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        {customer && (
          <p className="text-xs text-gray-500 mt-2">
            Discount applied:{" "}
            <span className="text-green-600 font-medium">
              {discount}%
            </span>
          </p>
        )}
      </div>


      <div className="bg-white p-5 rounded-lg shadow-sm">
        <h3 className="text-sm font-medium text-gray-600 mb-3">
          Items
        </h3>

        <div className="space-y-3">
          {rows.map((row, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-3 items-center"
            >
              <select
                value={row.item}
                onChange={(e) =>
                  handleChange(i, "item", e.target.value)
                }
                className="col-span-2 border rounded p-2 text-sm"
              >
                <option value="">Select item</option>
                {itemsList.map((it) => (
                  <option key={it._id} value={it._id}>
                    {it.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={row.quantity}
                min="1"
                onChange={(e) =>
                  handleChange(
                    i,
                    "quantity",
                    Number(e.target.value)
                  )
                }
                className="border rounded p-2 text-sm text-center"
              />

              <p className="text-sm text-gray-600">
                Rs {row.price}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  Rs {row.total}
                </span>

                <button
                  onClick={() => removeRow(i)}
                  className="text-red-400 hover:text-red-600 text-sm"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addRow}
          className="mt-4 text-sm text-blue-600 hover:underline"
        >
          + Add Item
        </button>
      </div>

   
      <div className="bg-white p-5 rounded-lg shadow-sm">
        <div className="space-y-2 text-sm text-gray-600">

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>Rs {subtotal}</span>
          </div>

          <div className="flex justify-between">
            <span>Discount ({discount}%)</span>
            <span className="text-green-600">
              - Rs {discountAmount}
            </span>
          </div>

          <div className="border-t pt-3 flex justify-between text-base font-semibold text-gray-800">
            <span>Total</span>
            <span>Rs {grandTotal}</span>
          </div>

        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-black text-white py-3 rounded-md text-sm hover:bg-gray-800 transition"
      >
        Save Invoice
      </button>

    </div>
  </div>
);
}

export default CreateInvoice;