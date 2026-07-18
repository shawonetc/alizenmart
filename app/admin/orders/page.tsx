"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { HugeiconsIcon } from "@hugeicons/react";
import { Search01Icon, FilterIcon } from "@hugeicons/core-free-icons";

export default function AdminOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setFetchError(null);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      setFetchError(error.message);
      setOrders([]);
    } else if (data) {
      setOrders(data);
    }
    setLoading(false);
  };

  const updateStatus = async (id: any, newStatus: string) => {
    const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    if (error) {
      alert("Error updating status: " + error.message);
    } else {
      fetchOrders();
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      String(order.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(order.customer_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(order.phone || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(order.address || "").toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "All" || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
          <p className="text-gray-500 text-sm mt-1 font-medium">Track and manage customer orders, payments, and shipments.</p>
        </div>
        <button 
          onClick={fetchOrders}
          className="text-xs font-bold text-[#1a80c2] bg-blue-50 hover:bg-blue-100 transition-colors px-3 py-1.5 rounded-lg"
        >
          🔄 Refresh Orders
        </button>
      </div>

      {/* Error Banner */}
      {fetchError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-red-500 text-lg">⚠️</span>
          <div>
            <p className="text-sm font-bold text-red-700">Supabase Error</p>
            <p className="text-xs text-red-600 mt-0.5">{fetchError}</p>
            <p className="text-xs text-red-500 mt-2 font-medium">
              Fix: Run the SQL script in Supabase Dashboard → SQL Editor to fix RLS policies.
            </p>
          </div>
        </div>
      )}

      {/* Order List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders by ID, customer or phone..." 
              className="w-full bg-gray-50 border-none rounded-xl py-2.5 px-4 pl-12 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all text-gray-800"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <HugeiconsIcon icon={Search01Icon} size={18} />
            </span>
          </div>
          <div className="flex items-center gap-3">
             <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
               <HugeiconsIcon icon={FilterIcon} size={14} /> Filter:
             </span>
             <select 
               value={statusFilter}
               onChange={(e) => setStatusFilter(e.target.value)}
               className="bg-gray-50 border border-gray-100 rounded-xl py-2 px-4 text-xs font-bold text-gray-600 outline-none cursor-pointer hover:bg-gray-100 transition-all"
             >
               <option value="All">All Statuses</option>
               <option value="Pending">Pending</option>
               <option value="Processing">Processing</option>
               <option value="Shipped">Shipped</option>
               <option value="Delivered">Delivered</option>
               <option value="Cancelled">Cancelled</option>
             </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Customer Info</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Payment</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400 font-medium italic">Loading orders from Supabase...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-400 font-medium italic">No orders found matching the filters.</td>
                </tr>
              ) : filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr 
                    className="hover:bg-gray-50/30 transition-colors cursor-pointer"
                    onClick={() => setExpandedOrderId(expandedOrderId === order.id ? null : order.id)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 font-bold transition-transform">
                          {expandedOrderId === order.id ? "▼" : "▶"}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-gray-800">
                            #{String(order.id).substring(0, 8).toUpperCase()}
                          </p>
                          <p className="text-[10px] text-gray-400 font-semibold uppercase">
                            {new Date(order.created_at).toLocaleDateString()} at {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-800">{order.customer_name || "Guest"}</p>
                      <p className="text-[11px] text-gray-500 font-medium">{order.phone}</p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">৳ {order.total || order.total_amount}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        order.status === "Delivered" ? "bg-green-100 text-green-700" :
                        order.status === "Processing" ? "bg-blue-100 text-blue-700" :
                        order.status === "Shipped" ? "bg-purple-100 text-purple-700" :
                        order.status === "Cancelled" ? "bg-red-100 text-red-700" :
                        "bg-orange-100 text-orange-700"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase border ${
                        order.payment_method === "bkash" ? "bg-pink-50 border-pink-200 text-pink-700 font-extrabold" : "bg-gray-50 border-gray-200 text-gray-600"
                      }`}>
                        {order.payment_method === "bkash" ? "bKash" : "COD"}
                      </span>
                    </td>
                    <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                      <select 
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        className="bg-gray-50 border border-gray-100 rounded-lg py-1.5 px-3 text-[11px] font-bold text-gray-600 outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>

                  {/* Expanded Order Details Panel */}
                  {expandedOrderId === order.id && (
                    <tr>
                      <td colSpan={6} className="bg-gray-50/50 px-8 py-6 border-t border-b border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                          {/* Shipping Address */}
                          <div className="space-y-2 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col justify-between">
                            <div>
                              <h4 className="font-bold text-gray-800 border-b border-gray-50 pb-2 flex items-center gap-1.5">
                                📍 Delivery Address
                              </h4>
                              <p className="text-xs text-gray-600 leading-relaxed font-semibold mt-2 bg-gray-50 p-2.5 rounded border border-gray-100">
                                {order.address || "No address provided"}
                              </p>
                            </div>
                            {order.notes && (
                              <div className="pt-2">
                                <span className="text-[10px] uppercase font-bold text-gray-400">Order Note:</span>
                                <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded border border-amber-100 mt-1 italic">
                                  "{order.notes}"
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Payment Details */}
                          <div className="space-y-2 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-gray-800 border-b border-gray-50 pb-2 flex items-center gap-1.5">
                              💳 Payment Information
                            </h4>
                            <div className="space-y-2 text-xs text-gray-600 font-semibold mt-2">
                              <p className="flex justify-between">
                                <span className="text-gray-400">Payment Method:</span>
                                <span className="uppercase text-gray-800 font-bold">{order.payment_method || "COD"}</span>
                              </p>
                              {order.payment_method === "bkash" && (
                                <>
                                  <p className="flex justify-between">
                                    <span className="text-gray-400">bKash Number:</span>
                                    <span className="text-gray-800 font-bold">{order.bkash_number || "N/A"}</span>
                                  </p>
                                  <p className="flex justify-between">
                                    <span className="text-gray-400">Transaction ID:</span>
                                    <span className="text-[#1a80c2] font-mono break-all select-all font-bold bg-blue-50 px-1 rounded">{order.transaction_id || "N/A"}</span>
                                  </p>
                                </>
                              )}
                              <p className="flex justify-between border-t border-gray-100 pt-2 font-bold text-sm">
                                <span className="text-gray-500">Order Total:</span>
                                <span className="text-green-600">৳ {order.total || order.total_amount}</span>
                              </p>
                            </div>
                          </div>

                          {/* Ordered Items List */}
                          <div className="space-y-2 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                            <h4 className="font-bold text-gray-800 border-b border-gray-50 pb-2 flex items-center gap-1.5">
                              🛍️ Ordered Items
                            </h4>
                            <div className="space-y-3 max-h-[160px] overflow-y-auto pr-1 mt-2">
                              {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                                order.items.map((item: any, idx: number) => (
                                  <div key={idx} className="flex gap-3 items-center pb-2 border-b border-gray-50 last:border-0 last:pb-0">
                                    <div className="w-10 h-10 relative bg-gray-50 rounded border border-gray-100 p-1 flex-shrink-0">
                                      <img 
                                        src={item.image || "/placeholder.png"} 
                                        alt={item.title} 
                                        className="object-contain w-full h-full"
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).src = "/placeholder.png";
                                        }}
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-xs font-bold text-gray-700 truncate">{item.title}</p>
                                      <p className="text-[10px] text-gray-400">
                                        ৳{item.price} × {item.quantity}
                                      </p>
                                    </div>
                                    <div className="text-right text-xs font-bold text-gray-800">
                                      ৳{item.price * item.quantity}
                                    </div>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-gray-400 italic text-center py-4">No product items details recorded.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
