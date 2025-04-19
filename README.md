# 🛒 Sales & Revenue Analytics API (GraphQL + MongoDB)

This is a take-home project for building a GraphQL API with MongoDB for sales and analytics in an e-commerce platform.

## 📦 Tech Stack

- Node.js
- Express
- GraphQL (`express-graphql`)
- MongoDB (Compass or Atlas)
- Redis (for caching analytics)
- Mongoose

---

## 🚀 Features Implemented

### ✅ Core Queries

1. **getCustomerSpending**  
   Returns total spent, average order value, and last order date for a given customer (only completed orders).

2. **getTopSellingProducts**  
   Returns most sold products by quantity.

3. **getSalesAnalytics**  
   Returns revenue, completed order count, and revenue breakdown by category (uses Redis cache for speed).

---

### 🧪 Bonus Features

- ✅ `placeOrder` mutation
- ✅ Paginated `getCustomerOrders`
- ✅ Redis caching
- ✅ Sample seed data (CSV → JSON)
- ✅ UUID-compatible models

---

## 📁 How to Run

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/sales-analytics-api
cd sales-analytics-api
npm install
```

### 2. Import seed data (JSON)

Import `customers_fixed.json`, `products_fixed.json`, and `orders_fixed.json` into MongoDB using Compass.

### 3. Run the server

```bash
node index.js
```

---

## ⚙️ Dependencies

```bash
npm install express express-graphql graphql mongoose ioredis dotenv
```

---

## 🧪 Testing Queries

Go to `http://localhost:4000/graphql` and run queries from `queries.graphql`.

---

## ✅ Example Result

```json
{
  "getCustomerSpending": {
    "customerId": "bb46046e-...",
    "totalSpent": 700.7,
    "averageOrderValue": 700.7,
    "lastOrderDate": "2025-01-13T10:35:58.471788"
  }
}
```

---

Made with ❤️ for a better sales dashboard.
