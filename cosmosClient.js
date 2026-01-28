const { CosmosClient } = require("@azure/cosmos");

const endpoint = process.env.COSMOS_ENDPOINT;
const key = process.env.COSMOS_KEY;
const databaseId = process.env.COSMOS_DATABASE;   // trackerdb
const containerId = process.env.COSMOS_CONTAINER; // tasks

if (!endpoint || !key || !databaseId || !containerId) {
  throw new Error("Missing Cosmos config: COSMOS_ENDPOINT/KEY/DATABASE/CONTAINER");
}

const client = new CosmosClient({ endpoint, key });

const tasksContainer = client.database(databaseId).container(containerId);

module.exports = { tasksContainer };