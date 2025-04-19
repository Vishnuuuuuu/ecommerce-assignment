const { v4: uuidv4 } = require('uuid');
const Redis = require('ioredis');

const Order = require('../models/Order');
const Product = require('../models/Product');
const Customer = require('../models/Customer');

const redis = new Redis();

// ─── getCustomerSpending ─────────────────────────────

async function getCustomerSpending(_, { customerId }) {
  const orders = await Order.find({ customerId, status: "completed" });
  if (!orders.length) return null;

  const totalSpent = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const averageOrderValue = totalSpent / orders.length;
  const lastOrderDate = new Date(Math.max(...orders.map(o => new Date(o.orderDate))));

  return {
    customerId,
    totalSpent,
    averageOrderValue,
    lastOrderDate
  };
}

// ─── getTopSellingProducts ───────────────────────────

async function getTopSellingProducts(_, { limit }) {
  const result = await Order.aggregate([
    { $match: { status: "completed" } },
    { $unwind: "$products" },
    {
      $group: {
        _id: "$products.productId",
        totalSold: { $sum: "$products.quantity" }
      }
    },
    { $sort: { totalSold: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "products",
        localField: "_id",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },
    {
      $project: {
        productId: "$_id",
        name: "$product.name",
        totalSold: 1
      }
    }
  ]);

  return result;
}

// ─── getSalesAnalytics ───────────────────────────────

async function getSalesAnalytics(_, { startDate, endDate }) {
  const cacheKey = `salesAnalytics:${startDate}:${endDate}`;
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);

  const result = await Order.aggregate([
    {
      $match: {
        status: "completed",
        orderDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      }
    },
    { $unwind: "$products" },
    {
      $lookup: {
        from: "products",
        localField: "products.productId",
        foreignField: "_id",
        as: "product"
      }
    },
    { $unwind: "$product" },
    {
      $group: {
        _id: "$product.category",
        revenue: {
          $sum: {
            $multiply: ["$products.quantity", "$products.priceAtPurchase"]
          }
        }
      }
    },
    {
      $project: {
        category: "$_id",
        revenue: 1
      }
    }
  ]);

  const completedOrders = await Order.countDocuments({
    status: "completed",
    orderDate: {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    }
  });

  const totalRevenue = result.reduce((sum, r) => sum + r.revenue, 0);
  const categoryBreakdown = result;

  const response = {
    totalRevenue,
    completedOrders,
    categoryBreakdown
  };

  await redis.set(cacheKey, JSON.stringify(response), 'EX', 300); // cache for 5 mins
  return response;
}

// ─── placeOrder (UUID-based) ─────────────────────────

async function placeOrder(_, { input }) {
  const newOrder = new Order({
    _id: uuidv4(),
    customerId: input.customerId,
    products: input.products,
    totalAmount: input.totalAmount,
    orderDate: new Date(input.orderDate),
    status: input.status || "pending"
  });

  return await newOrder.save();
}

// ─── getCustomerOrders (pagination) ──────────────────

async function getCustomerOrders(_, { customerId, limit = 10, offset = 0 }) {
  return await Order.find({ customerId })
    .sort({ orderDate: -1 })
    .skip(offset)
    .limit(limit);
}

// ─── Export ──────────────────────────────────────────

module.exports = {
  getCustomerSpending,
  getTopSellingProducts,
  getSalesAnalytics,
  placeOrder,
  getCustomerOrders
};
