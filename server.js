const express = require('express');
const app = express();

const api = require("./router/api");
require('dotenv').config();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use("/", api);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});