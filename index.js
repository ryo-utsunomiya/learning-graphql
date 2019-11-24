const fs = require('fs');
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const graphqlPlayground = require('graphql-playground-middleware-express').default;
const { MongoClient } = require('mongodb');
require('dotenv').config();
const resolvers = require('./resolvers');

const typeDefs = fs.readFileSync('schema.graphql', { encoding: 'UTF-8' });

async function start() {
  const app = express();
  const MONGO_DB = process.env.DB_HOST;

  const client = await MongoClient.connect(MONGO_DB, { useUnifiedTopology: true });
  const db = client.db();
  const context = { db };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context,
  });
  server.applyMiddleware({ app });

  app.get('/', (req, res) => res.end('Welcome to the PhotoShare API'));
  app.get('/playground', graphqlPlayground({ endpoint: server.graphqlPath }));

  app.listen({ port: 4000 }, () => {
    console.log(`GraphQL Server running at http://localhost:4000${server.graphqlPath}`);
  });
}

start();
