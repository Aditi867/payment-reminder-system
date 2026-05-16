import { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  LayoutDashboard,
  FileText,
  Send,
  Users,
  BarChart3,
  Settings,
  Plus,
  Search,
  Wallet,
  Clock,
  CheckCircle,
  AlertCircle,
  Trash2,
} from "lucide-react";

export default function App() {
  const [invoices, setInvoices] = useState(() => {
    const savedInvoices = localStorage.getItem("invoices");
    return savedInvoices ? JSON.parse(savedInvoices) : [];
  });

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [formData, setFormData] = useState({
    customer: "",
    email: "",
    amount: "",
    dueDate: "",
    status: "Pending",
  });

  useEffect(() => {
    localStorage.setItem("invoices", JSON.stringify(invoices));
  }, [invoices]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newInvoice = {
      id: Date.now(),
      invoiceId: `INV-${Math.floor(1000 + Math.random() * 9000)}`,
      ...formData,
      activity: ["Invoice created"],
      lastReminder: "—",
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
    setInvoices(
      invoices.map((invoice) =>
        invoice.id === id
          ? {
              ...invoice,
              status: "Paid",
              activity: [...invoice.activity, "Marked as paid"],
            }
          : invoice
      )
    );
  };

  const deleteInvoice = (id) => {
    setInvoices(invoices.filter((invoice) => invoice.id !== id));
  };

  const sendReminder = async (id) => {
    const invoice = invoices.find((item) => item.id === id);

    try {
      await axios.post("http://localhost:5000/send-reminder", {
        customer: invoice.customer,
        email: invoice.email,
        amount: invoice.amount,
      });

      setInvoices(
        invoices.map((invoice) =>
          invoice.id === id
            ? {
                ...invoice,
                activity: [
                  ...invoice.activity,
                  `Reminder email sent on ${new Date().toLocaleString()}`
                ],
                
                lastReminder: new Date().toLocaleString(),
              }
            : invoice
        )
      );

      alert("Email reminder sent!");
    } catch (error) {
      console.log(error);
      alert("Failed to send email");
    }
  };

  const today = new Date();

  const updatedInvoices = invoices.map((invoice) => {
    const isOverdue =
      invoice.status !== "Paid" && new Date(invoice.dueDate) < today;

    return {
      ...invoice,
      status: isOverdue ? "Overdue" : invoice.status,
    };
  });

  const filteredInvoices = updatedInvoices.filter((invoice) => {
    const matchesSearch =
      invoice.customer.toLowerCase().includes(search.toLowerCase()) ||
      invoice.email.toLowerCase().includes(search.toLowerCase()) ||
      (invoice.invoiceId || "").toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" ? true : invoice.status === filter;

    return matchesSearch && matchesFilter;
  });

  const totalInvoices = invoices.length;

  const paidInvoices = updatedInvoices.filter(
    (invoice) => invoice.status === "Paid"
  ).length;

  const overdueInvoices = updatedInvoices.filter(
    (invoice) => invoice.status === "Overdue"
  ).length;

  const pendingInvoices = updatedInvoices.filter(
    (invoice) => invoice.status === "Pending"
  ).length;

  const totalAmount = invoices.reduce(
    (acc, invoice) => acc + Number(invoice.amount),
    0
  );

  const pendingAmount = updatedInvoices
    .filter((invoice) => invoice.status !== "Paid")
    .reduce((acc, invoice) => acc + Number(invoice.amount), 0);

  const recentActivities = updatedInvoices
  .filter((invoice) => invoice.lastReminder && invoice.lastReminder !== "—")
  .map((invoice) => ({
    text: `Reminder sent on ${invoice.lastReminder}`,
    customer: invoice.customer,
    invoiceId: invoice.invoiceId,
  }))
  .slice(-3)
  .reverse();

  const upcomingDue = updatedInvoices
    .filter((invoice) => invoice.status !== "Paid")
    .slice(0, 3);

  const statusClass = (status) => {
    if (status === "Paid") return "bg-green-100 text-green-700";
    if (status === "Overdue") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  const chartData = [
    { name: "Paid", value: paidInvoices },
    { name: "Pending", value: pendingInvoices },
    { name: "Overdue", value: overdueInvoices },
  ];

  const chartColors = ["#22c55e", "#eab308", "#ef4444"];

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <aside className="hidden lg:flex w-64 bg-[#06245c] text-white flex-col justify-between p-6">
        <div>
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-blue-500 p-2 rounded-xl">
              <Wallet size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-bold">PayRemind</h1>
              <p className="text-xs text-blue-100">Payment Reminder System</p>
            </div>
          </div>

          <nav className="space-y-3">
            <div className="bg-blue-600 px-4 py-3 rounded-xl flex items-center gap-3">
              <LayoutDashboard size={18} />
              Dashboard
            </div>

            <div className="px-4 py-3 flex items-center gap-3 text-blue-100">
              <FileText size={18} />
              Invoices
            </div>

            <div className="px-4 py-3 flex items-center gap-3 text-blue-100">
              <Send size={18} />
              Reminders
            </div>

            <div className="px-4 py-3 flex items-center gap-3 text-blue-100">
              <Users size={18} />
              Customers
            </div>

            <div className="px-4 py-3 flex items-center gap-3 text-blue-100">
              <BarChart3 size={18} />
              Reports
            </div>

            <div className="px-4 py-3 flex items-center gap-3 text-blue-100">
              <Settings size={18} />
              Settings
            </div>
          </nav>
        </div>

        <p className="text-xs text-blue-100">© 2026 PayRemind</p>
      </aside>

      <main className="flex-1 p-5 lg:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-500">Welcome back, Admin!</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-5 rounded-2xl shadow-sm border mb-6"
        >
          <h2 className="text-lg font-bold mb-4">Create New Invoice</h2>

          <div className="grid md:grid-cols-5 gap-3">
            <input
              type="text"
              placeholder="Customer name"
              value={formData.customer}
              onChange={(e) =>
                setFormData({ ...formData, customer: e.target.value })
              }
              className="border p-3 rounded-xl"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="border p-3 rounded-xl"
              required
            />

            <input
              type="number"
              placeholder="Amount"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="border p-3 rounded-xl"
              required
            />

            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="border p-3 rounded-xl"
              required
            />

            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2 py-3">
              <Plus size={18} />
              New Invoice
            </button>
          </div>
        </form>

        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4 mb-6">
          <StatCard
            title="Total Invoices"
            value={totalInvoices}
            icon={<FileText />}
            color="blue"
          />
          <StatCard
            title="Total Amount"
            value={`₹${totalAmount}`}
            icon={<Wallet />}
            color="green"
          />
          <StatCard
            title="Pending Amount"
            value={`₹${pendingAmount}`}
            icon={<Clock />}
            color="yellow"
          />
          <StatCard
            title="Overdue Invoices"
            value={overdueInvoices}
            icon={<AlertCircle />}
            color="red"
          />
          <StatCard
            title="Paid Invoices"
            value={paidInvoices}
            icon={<CheckCircle />}
            color="green"
          />
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border mb-6">
          <h2 className="font-bold mb-4">Paid vs Pending vs Overdue</h2>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="value"
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={chartColors[index]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-sm border mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-3 text-slate-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search by customer, email or invoice ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border p-3 pl-10 rounded-xl"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border p-3 rounded-xl"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Overdue">Overdue</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setFilter("All");
            }}
            type="button"
            className="border px-5 rounded-xl"
          >
            Clear Filters
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-6">
          <h2 className="font-bold p-5">Recent Invoices</h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="p-4 text-left">Invoice ID</th>
                  <th className="p-4 text-left">Customer</th>
                  <th className="p-4 text-left">Email</th>
                  <th className="p-4 text-left">Amount</th>
                  <th className="p-4 text-left">Due Date</th>
                  <th className="p-4 text-left">Status</th>
                  <th className="p-4 text-left">Last Reminder</th>
                  <th className="p-4 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredInvoices.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-6 text-center text-slate-500">
                      No invoices found.
                    </td>
                  </tr>
                )}

                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-t">
                    <td className="p-4 font-semibold">
                      {invoice.invoiceId || `INV-${invoice.id}`}
                    </td>
                    <td className="p-4">{invoice.customer}</td>
                    <td className="p-4 text-slate-500">{invoice.email}</td>
                    <td className="p-4 font-semibold">₹{invoice.amount}</td>
                    <td className="p-4">{invoice.dueDate}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${statusClass(
                          invoice.status
                        )}`}
                      >
                        {invoice.status}
                      </span>
                    </td>
                    <td className="p-4">{invoice.lastReminder || "—"}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        {invoice.status !== "Paid" && (
                          <button
                            onClick={() => markAsPaid(invoice.id)}
                            className="border p-2 rounded-lg hover:bg-green-50"
                            title="Mark Paid"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}

                        <button
                          onClick={() => sendReminder(invoice.id)}
                          className="border p-2 rounded-lg hover:bg-blue-50"
                          title="Send Reminder"
                        >
                          <Send size={16} />
                        </button>

                        <button
                          onClick={() => deleteInvoice(invoice.id)}
                          className="border p-2 rounded-lg hover:bg-red-50 text-red-500"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white p-5 rounded-2xl shadow-sm border">
            <h2 className="font-bold mb-4">Recent Activities</h2>

            {recentActivities.length === 0 ? (
              <p className="text-slate-500">No recent activities yet.</p>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-xl">
                      <Send size={16} />
                    </div>
                    <div>
                      <p className="font-medium">{activity.text}</p>
                      <p className="text-sm text-slate-500">
                        {activity.customer} • {activity.invoiceId}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border">
            <h2 className="font-bold mb-4">Upcoming Due</h2>

            {upcomingDue.length === 0 ? (
              <p className="text-slate-500">No pending invoices.</p>
            ) : (
              <div className="space-y-4">
                {upcomingDue.map((invoice) => (
                  <div
                    key={invoice.id}
                    className="flex items-center justify-between border-b pb-3"
                  >
                    <div>
                      <p className="font-medium">{invoice.customer}</p>
                      <p className="text-sm text-slate-500">
                        {invoice.invoiceId || `INV-${invoice.id}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{invoice.dueDate}</p>
                      <p className="text-red-500 font-semibold">
                        ₹{invoice.amount}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  const colors = {
    blue: "bg-blue-100 text-blue-600 border-blue-200",
    green: "bg-green-100 text-green-600 border-green-200",
    yellow: "bg-yellow-100 text-yellow-600 border-yellow-200",
    red: "bg-red-100 text-red-600 border-red-200",
  };

  return (
    <div
      className={`bg-white p-5 rounded-2xl shadow-sm border ${colors[color]}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm font-medium">{title}</p>
          <h2 className="text-2xl font-bold mt-2">{value}</h2>
          <p className="text-xs mt-2 opacity-70">All time</p>
        </div>

        <div className="p-3 rounded-xl bg-white/70">{icon}</div>
      </div>
    </div>
  );
}