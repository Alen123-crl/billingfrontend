import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInvoiceByIdAPI } from "../services/allAPI";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

function ViewInvoice() {
  const { id } = useParams();
  const navigate = useNavigate();
  const invoiceRef = useRef();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const res = await getInvoiceByIdAPI(id);
      setInvoice(res.data.data);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load invoice");
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = async () => {
    try {
      const element = invoiceRef.current;

    
      const canvas = await html2canvas(element, {
        scale: 3, 
        useCORS: true, 
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;


      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

  
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(`invoice-${invoice._id.slice(-4)}.pdf`);
    } catch (err) {
      console.log("PDF ERROR:", err);
      alert("Failed to generate PDF");
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!invoice) return <p className="p-6 text-red-500">Invoice not found</p>;

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div ref={invoiceRef} className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6">
     
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500">INVOICE</p>
            <h2 className="text-2xl font-bold">#{invoice._id.slice(-4)}</h2>
            <p className="text-gray-500">
              Date: {new Date(invoice.date).toLocaleDateString()}
            </p>
          </div>

          <div className="flex gap-3 print:hidden">
            <button
              onClick={() => navigate("/invoices")}
              className="border px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Back to invoices
            </button>
            <button
              onClick={handlePrint}
              className="bg-black text-white px-4 py-2 rounded-lg hover:opacity-90"
            >
              Print PDF
            </button>
          </div>
        </div>

   
        <div className="border rounded-xl p-4 mb-6">
          <p className="text-gray-500 text-sm">BILL TO</p>
          <h3 className="text-lg font-semibold">{invoice.customer?.name}</h3>
          <p className="text-gray-500">Discount: {invoice.discount}%</p>
        </div>

   
        <table className="w-full text-center border rounded-lg overflow-hidden mb-6">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3">Item</th>
              <th className="p-3">Qty</th>
              <th className="p-3">Price</th>
              <th className="p-3">Line Total</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, index) => (
              <tr key={index} className="border-t">
                <td>{item.item?.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price}</td>
                <td>${item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="border rounded-xl p-4 w-72">
            <p className="text-gray-500 text-sm mb-2">TOTALS</p>
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${invoice.subtotal}</span>
            </div>
            <div className="flex justify-between">
              <span>Discount</span>
              <span>{invoice.discount}%</span>
            </div>
            <div className="flex justify-between font-bold text-lg mt-2">
              <span>Total</span>
              <span>${invoice.total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewInvoice;