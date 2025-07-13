import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  Home,
  DollarSign,
  TrendingUp,
  User,
  Package,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Minus,
  Settings,
  BarChart3,
  Brain,
  Zap,
} from "lucide-react";

const API_BASE_URL = "http://localhost:8080";

const AutonomousShoppingApp = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState(null);
  const [householdItems, setHouseholdItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [budget, setBudget] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("U129");
  const [showInitModal, setShowInitModal] = useState(false);
  const [initItems, setInitItems] = useState([
    {
      productName: "",
      brand: "",
      quantity: 1,
      lastPurchaseDate: "",
      consumptionRate: 1,
      currentStock: 1,
      preferredReorderDay: "MONDAY",
      familySize: 1,
      itemStatus: "ACTIVE",
      price: 0,
      daysLeft: 30,
    },
  ]);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [newItem, setNewItem] = useState({
    productName: "",
    brand: "",
    quantity: 1,
    lastPurchaseDate: "",
    consumptionRate: 1,
    currentStock: 1,
    preferredReorderDay: "MONDAY",
    familySize: 1,
    itemStatus: "ACTIVE",
    price: 0,
    daysLeft: 30,
  });
  const [showBudgetPrompt, setShowBudgetPrompt] = useState(false);
  const [nextMonthBudget, setNextMonthBudget] = useState("");
  const [reorderQuantities, setReorderQuantities] = useState({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Handle budget submission
  const handleBudgetSubmit = async () => {
    if (!nextMonthBudget) return;
    try {
      await fetch(`${API_BASE_URL}/api/household/update-budget`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUserId,
          monthlyBudget: parseFloat(nextMonthBudget),
          remainingBudget: 0,
          lastResetDate: "dummy",
        }),
      });

      setShowBudgetPrompt(false);
    } catch (err) {
      console.error("Budget update failed:", err);
    }
  };
  const handleConfirmReorder = async () => {
    try {
      const reorderedItems = cartItems.map((item) => {
        const matched = householdItems.find(
          (hItem) => hItem.productId === item.productId
        );

        return {
          userId: currentUserId,
          productId: item.productId,
          productName: matched?.productName || "Unknown",
          brand: item.brand,
          quantity: reorderQuantities[item.productId] || item.quantity,
          lastPurchaseDate: item.lastPurchaseDate || "2024-01-01",
          consumptionRate: item.consumptionRate || 1,
          currentStock: reorderQuantities[item.productId] || item.quantity,
          preferredReorderDay: item.preferredReorderDay || "MONDAY",
          familySize: item.familySize || 4,
          itemStatus: "AVAILABLE",
          price: item.price || 50,
          daysLeft: item.daysLeft || 10,
        };
      });

      const response = await fetch(
        `${API_BASE_URL}/api/household/reorder-items`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(reorderedItems),
        }
      );

      const result = await response.text();
      console.log("Reorder Response:", result);
      setShowConfirmation(true);
      loadUserData();
    } catch (error) {
      console.error("Error reordering items:", error);
    }
  };

  // API Service Functions
  const apiService = {
    async fetchHouseholdItems(userId) {
      const response = await fetch(
        `${API_BASE_URL}/api/household/items/${userId}`
      );
      return response.json();
    },

    async fetchCart(userId) {
      const response = await fetch(
        `${API_BASE_URL}/api/household/cart/${userId}`
      );
      return response.json();
    },

    async fetchBudget(userId) {
      const response = await fetch(
        `${API_BASE_URL}/api/household/budget/${userId}`
      );
      return response.json();
    },

    async markItemFinished(itemId) {
      const response = await fetch(
        `${API_BASE_URL}/api/household/finish/${itemId}`,
        {
          method: "PUT",
        }
      );
      return response.text();
    },

    async initializeItems(items) {
      const response = await fetch(`${API_BASE_URL}/api/household/initialize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(items),
      });
      return response.text();
    },

    async predictBulkReorder(request) {
      const response = await fetch(
        `${API_BASE_URL}/api/household/cart/predict-reorder`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        }
      );
      return response.json();
    },
  };

  // Load data on component mount
  useEffect(() => {
    loadUserData();
  }, [currentUserId]);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const [items, cart, budgetData] = await Promise.all([
        apiService.fetchHouseholdItems(currentUserId),
        apiService.fetchCart(currentUserId),
        apiService.fetchBudget(currentUserId),
      ]);

      setHouseholdItems(items);
      setCartItems(cart);
      setReorderQuantities(
        cart.reduce((acc, item) => {
          acc[item.productId] = item.quantity;
          return acc;
        }, {})
      );

      setBudget(budgetData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };
  const updateInitItem = (index, field, value) => {
    const updated = [...initItems];
    updated[index][field] = value;
    setInitItems(updated);
  };

  const handleInitializeSubmit = async () => {
    try {
      const payload = initItems.map((item) => ({
        ...item,
        userId: currentUserId,
      }));

      await apiService.initializeItems(payload);
      setShowInitModal(false);
      loadUserData(); // refresh
    } catch (error) {
      console.error("Initialization failed:", error);
    }
  };
  const handleAddItemSubmit = async () => {
    try {
      const requestPayload = { ...newItem, userId: currentUserId };
      await fetch(`${API_BASE_URL}/api/household/additem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestPayload),
      });
      setShowAddItemModal(false);
      setNewItem({
        productName: "",
        brand: "",
        quantity: 1,
        lastPurchaseDate: "",
        consumptionRate: 1,
        currentStock: 1,
        preferredReorderDay: "MONDAY",
        familySize: 1,
        itemStatus: "ACTIVE",
        price: 0,
        daysLeft: 30,
      });
      loadUserData(); // Refresh items
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const handleMarkFinished = async (itemId) => {
    try {
      await apiService.markItemFinished(itemId);
      loadUserData(); // Refresh data
    } catch (error) {
      console.error("Error marking item as finished:", error);
    }
  };

  const handleBulkPredict = async () => {
    try {
      const request = {
        userId: currentUserId,
        familySize: 4,
        festivalFlag: false,
        nextMonthBudget: budget?.monthlyBudget || 5000,
      };
      const results = await apiService.predictBulkReorder(request);
      setPredictions(results);
    } catch (error) {
      console.error("Error predicting bulk reorder:", error);
    }
  };
  const handleQuantityChange = (productId, delta) => {
    setReorderQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + delta),
    }));
  };

  // Dashboard Component
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-lg">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Autonomous Shopping Dashboard
          </h1>
          <p className="text-gray-600">AI-powered household management</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-800">
                {householdItems.length}
              </p>
            </div>
            <Package className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Items in Cart</p>
              <p className="text-2xl font-bold text-gray-800">
                {cartItems.length}
              </p>
            </div>
            <ShoppingCart className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Monthly Budget</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{budget?.monthlyBudget || 0}
              </p>
            </div>
            <DollarSign className="w-10 h-10 text-purple-500" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Remaining Budget</p>
              <p className="text-2xl font-bold text-gray-800">
                ₹{budget?.remainingBudget || 0}
              </p>
            </div>
            <TrendingUp className="w-10 h-10 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Recent Items */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Household Items
        </h2>
        <div className="space-y-3">
          {householdItems.slice(0, 5).map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-gray-500" />
                <div>
                  <p className="font-medium text-gray-800">
                    {item.productName}
                  </p>
                  <p className="text-sm text-gray-600">{item.brand}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">
                    {item.currentStock} left
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.daysLeft} days remaining
                  </p>
                </div>
                <div
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.itemStatus === "FINISHED"
                      ? "bg-red-100 text-red-800"
                      : item.daysLeft < 3
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {item.itemStatus}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Inventory Management Component
  const InventoryManagement = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">
          Inventory Management
        </h1>
        {householdItems.length === 0 && (
          <button
            onClick={() => setShowInitModal(true)}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Initialize Items</span>
          </button>
        )}

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center space-x-2"
          onClick={() => setShowAddItemModal(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Your Household Items
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Consumption Rate
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Days Left
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {householdItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center space-x-3">
                      <Package className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.productName}
                        </p>
                        <p className="text-sm text-gray-600">{item.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    {item.currentStock}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-800">
                    {item.consumptionRate}/day
                  </td>
                  <td className="px-4 py-4">
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.daysLeft < 3
                          ? "bg-red-100 text-red-800"
                          : item.daysLeft < 7
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.daysLeft} days
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        item.itemStatus === "FINISHED"
                          ? "bg-red-100 text-red-800"
                          : item.itemStatus === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {item.itemStatus}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <button
                      onClick={() => handleMarkFinished(item.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      disabled={item.itemStatus === "FINISHED"}
                    >
                      {item.itemStatus === "FINISHED"
                        ? "Finished"
                        : "Mark Finished"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // Smart Cart Component
  const SmartCart = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Smart Shopping Cart
          </h1>
          <p className="text-gray-600">AI-powered auto-populated cart</p>
        </div>
        <button
          onClick={handleBulkPredict}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 flex items-center space-x-2"
        >
          <Brain className="w-4 h-4" />
          <span>AI Predict Quantities</span>
        </button>
      </div>

      {/* Cart Items */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="flex justify-end">
          <button
            onClick={() => setShowBudgetPrompt(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <Zap className="w-4 h-4" />
            <span>Reorder All Finished Items</span>
          </button>
        </div>

        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-lg font-semibold text-gray-800">
            Cart Items ({cartItems.length})
          </h2>
        </div>
        <div className="p-4">
          {showBudgetPrompt && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-lg font-semibold mb-4 text-gray-800">
                  Enter Budget for Next Month
                </h2>
                <input
                  type="number"
                  value={nextMonthBudget}
                  onChange={(e) => setNextMonthBudget(Number(e.target.value))}
                  className="w-full border rounded-md p-2 mt-2"
                  placeholder="Enter amount in ₹"
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowBudgetPrompt(false)}
                    className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBudgetSubmit}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          )}

          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                Your cart is empty. Items will be auto-added when needed.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Package className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.productId}
                      </p>
                      <p className="text-sm text-gray-600">{item.brand}</p>
                      <p className="text-xs text-gray-500">
                        Added: {new Date(item.addedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleQuantityChange(item.productId, -1)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-gray-800 font-medium">
                      {reorderQuantities[item.productId] || item.quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(item.productId, 1)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {cartItems.length > 0 && (
        <div className="flex justify-end mt-6">
          <button
            onClick={handleConfirmReorder}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Confirm Reorder
          </button>
        </div>
      )}

      {/* AI Predictions */}
      {predictions.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-4 bg-purple-50 border-b">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span>AI Predictions</span>
            </h2>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {predictions.map((pred) => (
                <div
                  key={pred.productId}
                  className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-800">
                      {pred.productId}
                    </p>
                    <p className="text-sm text-gray-600">{pred.brand}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-purple-600">
                      Predicted: {pred.predictedQuantity}
                    </p>
                    <p className="text-sm text-gray-600">
                      ₹{pred.currentPrice}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {showConfirmation && (
        <div className="mt-6 bg-green-100 text-green-800 p-4 rounded-lg text-center font-medium">
          ✅ All Items Reordered Successfully!
        </div>
      )}
    </div>
  );

  // Budget Tracking Component
  const BudgetTracking = () => (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Budget Tracking</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Monthly Budget
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Budget</span>
              <span className="text-2xl font-bold text-gray-800">
                ₹{budget?.monthlyBudget || 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Remaining</span>
              <span className="text-2xl font-bold text-green-600">
                ₹{budget?.remainingBudget || 0}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{
                  width: `${
                    budget
                      ? ((budget.monthlyBudget - budget.remainingBudget) /
                          budget.monthlyBudget) *
                        100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {budget
                ? Math.round(
                    ((budget.monthlyBudget - budget.remainingBudget) /
                      budget.monthlyBudget) *
                      100
                  )
                : 0}
              % of budget used
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            Spending Overview
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Last Reset</span>
              <span className="text-gray-800">
                {budget?.lastResetDate || "N/A"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Current Month</span>
              <span className="text-gray-800">
                {new Date().toLocaleDateString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Days Remaining</span>
              <span className="text-gray-800">
                {new Date(
                  new Date().getFullYear(),
                  new Date().getMonth() + 1,
                  0
                ).getDate() - new Date().getDate()}{" "}
                days
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Navigation Component
  const Navigation = () => (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-800">AutoShop</span>
            </div>
            <nav className="flex space-x-1">
              {[
                { id: "dashboard", label: "Dashboard", icon: Home },
                { id: "inventory", label: "Inventory", icon: Package },
                { id: "cart", label: "Smart Cart", icon: ShoppingCart },
                { id: "budget", label: "Budget", icon: DollarSign },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2 ${
                    activeTab === id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-600">
                User: {currentUserId}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Main Render
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {activeTab === "dashboard" && <Dashboard />}
            {activeTab === "inventory" && <InventoryManagement />}
            {activeTab === "cart" && <SmartCart />}
            {activeTab === "budget" && <BudgetTracking />}
          </>
        )}

        {showAddItemModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
              <h2 className="text-lg font-bold mb-4">Add New Household Item</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    name: "productName",
                    label: "Product Name",
                    type: "text",
                    placeholder: "Product Name",
                  },
                  {
                    name: "brand",
                    label: "Brand",
                    type: "text",
                    placeholder: "Brand",
                  },
                  {
                    name: "quantity",
                    label: "Quantity",
                    type: "number",
                    placeholder: "Quantity",
                  },
                  {
                    name: "lastPurchaseDate",
                    label: "Last Purchase Date",
                    type: "date",
                    placeholder: "Last Purchase Date",
                  },
                  {
                    name: "consumptionRate",
                    label: "Consumption Rate",
                    type: "number",
                    placeholder: "Consumption Rate",
                  },
                  {
                    name: "currentStock",
                    label: "Current Stock",
                    type: "number",
                    placeholder: "Current Stock",
                  },
                  {
                    name: "preferredReorderDay",
                    label: "Preferred Reorder Day",
                    type: "text",
                    placeholder: "Preferred Reorder Day",
                  },
                  {
                    name: "familySize",
                    label: "Family Size",
                    type: "number",
                    placeholder: "Family Size",
                  },
                  {
                    name: "price",
                    label: "Price",
                    type: "number",
                    placeholder: "Price",
                  },
                  {
                    name: "daysLeft",
                    label: "Days Left",
                    type: "number",
                    placeholder: "Days Left",
                  },
                ].map(({ name, label, type }) => (
                  <div key={name}>
                    <label className="block text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <input
                      type={type}
                      value={newItem[name]}
                      onChange={(e) =>
                        setNewItem({
                          ...newItem,
                          [name]:
                            type === "number"
                              ? parseFloat(e.target.value) || 0
                              : e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowAddItemModal(false)}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItemSubmit}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        )}

        {showInitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
              <h2 className="text-lg font-bold mb-4">
                Initialize Household Items
              </h2>

              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {initItems.map((item, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-2 md:grid-cols-3 gap-4 border-b pb-4"
                  >
                    <input
                      type="text"
                      placeholder="Product Name"
                      value={item.productName}
                      onChange={(e) =>
                        updateInitItem(index, "productName", e.target.value)
                      }
                      className="border p-2 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Brand"
                      value={item.brand}
                      onChange={(e) =>
                        updateInitItem(index, "brand", e.target.value)
                      }
                      className="border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Quantity"
                      value={item.quantity}
                      onChange={(e) =>
                        updateInitItem(
                          index,
                          "quantity",
                          parseInt(e.target.value)
                        )
                      }
                      className="border p-2 rounded"
                    />
                    <input
                      type="date"
                      placeholder="Last Purchase Date"
                      value={item.lastPurchaseDate}
                      onChange={(e) =>
                        updateInitItem(
                          index,
                          "lastPurchaseDate",
                          e.target.value
                        )
                      }
                      className="border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Consumption Rate"
                      value={item.consumptionRate}
                      onChange={(e) =>
                        updateInitItem(
                          index,
                          "consumptionRate",
                          parseFloat(e.target.value)
                        )
                      }
                      className="border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Current Stock"
                      value={item.currentStock}
                      onChange={(e) =>
                        updateInitItem(
                          index,
                          "currentStock",
                          parseInt(e.target.value)
                        )
                      }
                      className="border p-2 rounded"
                    />
                    <input
                      type="text"
                      placeholder="Preferred Reorder Day"
                      value={item.preferredReorderDay}
                      onChange={(e) =>
                        updateInitItem(
                          index,
                          "preferredReorderDay",
                          e.target.value.toUpperCase()
                        )
                      }
                      className="border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Family Size"
                      value={item.familySize}
                      onChange={(e) =>
                        updateInitItem(
                          index,
                          "familySize",
                          parseInt(e.target.value)
                        )
                      }
                      className="border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Price"
                      value={item.price}
                      onChange={(e) =>
                        updateInitItem(
                          index,
                          "price",
                          parseFloat(e.target.value)
                        )
                      }
                      className="border p-2 rounded"
                    />
                    <input
                      type="number"
                      placeholder="Days Left"
                      value={item.daysLeft}
                      onChange={(e) =>
                        updateInitItem(
                          index,
                          "daysLeft",
                          parseInt(e.target.value)
                        )
                      }
                      className="border p-2 rounded"
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() =>
                    setInitItems([
                      ...initItems,
                      {
                        productName: "",
                        brand: "",
                        quantity: 1,
                        lastPurchaseDate: "",
                        consumptionRate: 1,
                        currentStock: 1,
                        preferredReorderDay: "MONDAY",
                        familySize: 1,
                        itemStatus: "ACTIVE",
                        price: 0,
                        daysLeft: 30,
                      },
                    ])
                  }
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  + Add Another Item
                </button>

                <div className="space-x-2">
                  <button
                    onClick={() => setShowInitModal(false)}
                    className="bg-gray-300 px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleInitializeSubmit}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AutonomousShoppingApp;
