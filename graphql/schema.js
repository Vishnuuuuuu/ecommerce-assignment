const { GraphQLObjectType, GraphQLSchema, GraphQLID, GraphQLFloat, GraphQLString, GraphQLList, GraphQLInt, GraphQLInputObjectType } = require('graphql');
const resolvers = require('./resolvers');

// ─── Types ──────────────────────────────────────────────

const CustomerSpendingType = new GraphQLObjectType({
  name: 'CustomerSpending',
  fields: () => ({
    customerId: { type: GraphQLID },
    totalSpent: { type: GraphQLFloat },
    averageOrderValue: { type: GraphQLFloat },
    lastOrderDate: { type: GraphQLString }
  })
});

const TopProductType = new GraphQLObjectType({
  name: 'TopProduct',
  fields: () => ({
    productId: { type: GraphQLID },
    name: { type: GraphQLString },
    totalSold: { type: GraphQLInt }
  })
});

const CategoryRevenueType = new GraphQLObjectType({
  name: 'CategoryRevenue',
  fields: () => ({
    category: { type: GraphQLString },
    revenue: { type: GraphQLFloat }
  })
});

const SalesAnalyticsType = new GraphQLObjectType({
  name: 'SalesAnalytics',
  fields: () => ({
    totalRevenue: { type: GraphQLFloat },
    completedOrders: { type: GraphQLInt },
    categoryBreakdown: { type: new GraphQLList(CategoryRevenueType) }
  })
});

const OrderType = new GraphQLObjectType({
  name: 'Order',
  fields: () => ({
    _id: { type: GraphQLID },
    customerId: { type: GraphQLID },
    products: {
      type: new GraphQLList(
        new GraphQLObjectType({
          name: 'OrderProduct',
          fields: () => ({
            productId: { type: GraphQLID },
            quantity: { type: GraphQLInt },
            priceAtPurchase: { type: GraphQLFloat }
          })
        })
      )
    },
    totalAmount: { type: GraphQLFloat },
    orderDate: { type: GraphQLString },
    status: { type: GraphQLString }
  })
});

// ─── Input for Mutation ────────────────────────────────

const OrderInputType = new GraphQLInputObjectType({
  name: 'OrderInput',
  fields: {
    customerId: { type: GraphQLID },
    products: {
      type: new GraphQLList(
        new GraphQLInputObjectType({
          name: 'OrderProductInput',
          fields: {
            productId: { type: GraphQLID },
            quantity: { type: GraphQLInt },
            priceAtPurchase: { type: GraphQLFloat }
          }
        })
      )
    },
    totalAmount: { type: GraphQLFloat },
    orderDate: { type: GraphQLString },
    status: { type: GraphQLString }
  }
});


// ─── Root Query ─────────────────────────────────────────

const RootQuery = new GraphQLObjectType({
  name: 'Query',
  fields: {
    getCustomerSpending: {
      type: CustomerSpendingType,
      args: { customerId: { type: GraphQLID } },
      resolve: resolvers.getCustomerSpending
    },
    getTopSellingProducts: {
      type: new GraphQLList(TopProductType),
      args: { limit: { type: GraphQLInt } },
      resolve: resolvers.getTopSellingProducts
    },
    getSalesAnalytics: {
      type: SalesAnalyticsType,
      args: {
        startDate: { type: GraphQLString },
        endDate: { type: GraphQLString }
      },
      resolve: resolvers.getSalesAnalytics
    },
    getCustomerOrders: {
      type: new GraphQLList(OrderType),
      args: {
        customerId: { type: GraphQLID },
        limit: { type: GraphQLInt },
        offset: { type: GraphQLInt }
      },
      resolve: resolvers.getCustomerOrders
    }
  }
});

// ─── Mutation ──────────────────────────────────────────

const Mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    placeOrder: {
      type: OrderType,
      args: {
        input: { type: OrderInputType }
      },
      resolve: resolvers.placeOrder
    }
  }
});

// ─── Export Schema ─────────────────────────────────────

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation
});
