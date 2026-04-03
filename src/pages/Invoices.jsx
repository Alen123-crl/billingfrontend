import { useEffect, useState } from "react";
import { getInvoicesAPI } from "../services/allAPI";
import { useNavigate } from "react-router-dom";

function Invoices() {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    try {
      const res = await getInvoicesAPI();
      setInvoices(res.data.data);
    } catch (err) {
      alert("Failed to load invoices");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">
              Invoices
            </h2>
            <p className="text-sm text-gray-500">
              Manage and track all invoices
            </p>
          </div>

          <button
            onClick={() => navigate("/invoices/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm shadow"
          >
            + New Invoice
          </button>
        </div>

       <div className="bg-white rounded-lg shadow-sm">

          {invoices.length > 0 ? (
            <div className="divide-y">

              {invoices.map((inv, index) => (
                <div
                  key={inv._id}
                  className="flex justify-between items-center p-4 hover:bg-gray-50 transition"
                >
        
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-800">
                      Invoice #{index + 1}
                    </p>

                    <p className="text-xs text-gray-500">
                      {inv.customer?.name} •{" "}
                      {new Date(inv.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="hidden md:flex gap-6 text-sm text-gray-600">
                    <p>
                      Discount:{" "}
                      <span className="text-green-600 font-medium">
                        {inv.discount}%
                      </span>
                    </p>

                    <p>
                      Total:{" "}
                      <span className="font-semibold text-gray-800">
                        ₹ {inv.total}
                      </span>
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      navigate(`/invoices/${inv._id}`)
                    }
                    className="text-blue-600 text-sm hover:underline"
                  >
                    View
                  </button>
                </div>
              ))}

            </div>
          ) : (
            <div className="p-10 text-center">
              <p className="text-gray-500 text-sm">
                No invoices created yet
              </p>

              <button
                onClick={() => navigate("/invoices/new")}
                className="mt-3 text-blue-600 text-sm hover:underline"
              >
                Create your first invoice
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Invoices;