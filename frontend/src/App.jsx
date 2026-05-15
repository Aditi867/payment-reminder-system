import { useState, useEffect } from "react";
import axios from "axios";

export default function App() {
  const [invoices, setInvoices] = useState(() => {
  const savedInvoices =
    localStorage.getItem("invoices");

  return savedInvoices
    ? JSON.parse(savedInvoices)
    : [];
});

useEffect(() => {
  localStorage.setItem(
    "invoices",
    JSON.stringify(invoices)
  );
}, [invoices]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [formData, setFormData] = useState({
    customer: "",
    email: "",
    amount: "",
    dueDate: "",
    status: "Pending",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const newInvoice = {
      id: Date.now(),
      ...formData,
      activity: ["Invoice created"],
    };

    setInvoices([newInvoice, ...invoices]);

    setFormData({
      customer: "",
      email: "",
      amount: "",
      dueDate: "",
      status: "Pending",
    });
  };

  const markAsPaid = (id) => {
    const updatedInvoices = invoices.map((invoice) => {
      if (invoice.id === id) {
        return {
          ...invoice,
          status: "Paid",
          activity: [...invoice.activity, "Marked as paid"],
        };
      }

      return invoice;
    });

    setInvoices(updatedInvoices);
  };

  const sendReminder = async (id) => {
  console.log("Button clicked");

  const invoice = invoices.find(
    (item) => item.id === id
  );
  
  const deleteInvoice = (id) => {
  const updatedInvoices = invoices.filter(
    (invoice) => invoice.id !== id
  );

  setInvoices(updatedInvoices);
};

  try {
    const response = await axios.post(
      "http://localhost:5000/send-reminder",
      {
        customer: invoice.customer,
        email: invoice.email,
        amount: invoice.amount,
      }
    );

    console.log(response.data);

    const updatedInvoices = invoices.map(
      (invoice) => {
        if (invoice.id === id) {
          return {
            ...invoice,
            activity: [
              ...invoice.activity,
              "Reminder email sent",
            ],
          };
        }

        return invoice;
      }
    );

    setInvoices(updatedInvoices);

    alert("Email reminder sent!");
  } catch (error) {
    console.log(error);

    alert("Failed to send email");
  }
};

  const today = new Date();

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = invoice.customer
      .toLowerCase()
      .includes(search.toLowerCase());

    const isOverdue =
      invoice.status !== "Paid" &&
      new Date(invoice.dueDate) < today;

    if (isOverdue) {
      invoice.status = "Overdue";
    }

    const matchesFilter =
      filter === "All"
        ? true
        : invoice.status === filter;

    return matchesSearch && matchesFilter;
  });

  const totalInvoices = invoices.length;

  const paidInvoices = invoices.filter(
    (invoice) => invoice.status === "Paid"
  ).length;

  const pendingAmount = invoices
    .filter((invoice) => invoice.status !== "Paid")
    .reduce((acc, invoice) => acc + Number(invoice.amount), 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">
        Payment Reminder Dashboard
      </h1>

      {/* DASHBOARD CARDS */}

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">
            Total Invoices
          </h2>

          <p className="text-3xl font-bold mt-2">
            {totalInvoices}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">
            Pending Amount
          </h2>

          <p className="text-3xl font-bold mt-2 text-yellow-500">
            ₹{pendingAmount}
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-gray-500">
            Paid Invoices
          </h2>

          <p className="text-3xl font-bold mt-2 text-green-600">
            {paidInvoices}
          </p>
        </div>
      </div>

      {/* CREATE FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8"
      >
        <h2 className="text-2xl font-bold mb-4">
          Create Invoice
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Customer Name"
            value={formData.customer}
            onChange={(e) =>
              setFormData({
                ...formData,
                customer: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="email"
            placeholder="Customer Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({
                ...formData,
                email: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData({
                ...formData,
                amount: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
            required
          />

          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({
                ...formData,
                dueDate: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
            required
          />
        </div>

        <button className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg">
          Create Invoice
        </button>
      </form>

      {/* SEARCH */}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search customer..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3 border p-3 rounded-lg"
        />
      </div>

      {/* FILTERS */}

      <div className="flex gap-3 mb-6 flex-wrap">
        <button
          onClick={() => setFilter("All")}
          className="bg-gray-200 px-4 py-2 rounded-lg"
        >
          All
        </button>

        <button
          onClick={() => setFilter("Pending")}
          className="bg-yellow-400 text-white px-4 py-2 rounded-lg"
        >
          Pending
        </button>

        <button
          onClick={() => setFilter("Paid")}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          Paid
        </button>

        <button
          onClick={() => setFilter("Overdue")}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
        >
          Overdue
        </button>
      </div>

      {/* INVOICE LIST */}

      <div className="grid gap-4">
        {filteredInvoices.map((invoice) => (
          <div
            key={invoice.id}
            className="bg-white p-6 rounded-xl shadow flex flex-col md:flex-row md:items-center md:justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold">
                {invoice.customer}
              </h2>

              <p className="text-gray-500">
                {invoice.email}
              </p>

              <p className="mt-2 font-semibold">
                Due: {invoice.dueDate}
              </p>
            </div>

            <div className="mt-4 md:mt-0">
              <p className="text-2xl font-bold mb-2">
                ₹{invoice.amount}
              </p>

              <span
                className={`px-4 py-2 rounded-full text-white text-sm ${
                  invoice.status === "Paid"
                    ? "bg-green-500"
                    : invoice.status === "Overdue"
                    ? "bg-red-500"
                    : "bg-yellow-500"
                }`}
              >
                {invoice.status}
              </span>

              <div className="flex gap-3 mt-4 flex-wrap">
                {invoice.status !== "Paid" && (
                  <button
                    onClick={() =>
                      markAsPaid(invoice.id)
                    }
                    className="bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Mark Paid
                  </button>
                )}

                <button
                  onClick={() =>
                    sendReminder(invoice.id)
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Send Reminder
                </button>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold mb-2">
                  Activity
                </h3>

                <ul className="text-sm text-gray-600">
                  {invoice.activity.map(
                    (item, index) => (
                      <li key={index}>
                        • {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}