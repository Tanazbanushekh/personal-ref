const express = require("express");
const lead = require("./lead");

const app = express();

app.use(express.json());
app.use("/lead", lead);

module.exports = app;
