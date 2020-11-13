require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const APIRouter = require("./routes");
const { logTheInfo, logTheError } = require("./middlewares/config/logger");
const {
  handle404Error,
  handleDevErrors,
  handleClientErrors,
  logErrors,
} = require("./middlewares/error-handlers");
const { logTheTransaction } = require("./middlewares/config/logger");

app.enable('trust proxy');
app.use(bodyParser.urlencoded({ extended: true }));

// log everything that pass to the router
app.use((req, res, next) => {
  logTheTransaction(req.ip, `${req.originalUrl} - ${req.method}`);
  next();
});

app.use("/api", APIRouter);

app.get("/", (req, res) => {
  res.send("Hello from App Engine!");
});

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  logTheInfo(`Server listening on port ${PORT}...`);
});

// catch 404 and forward to error handler
// triggered when a non-existent route attempts to be accessed
app.use(handle404Error);
// log the errors
app.use(logErrors);
// client error handler
app.use(handleClientErrors);
// dev error handler
app.use(handleDevErrors);

process.on("unhandledRejection", (reason, promise) => {
  logTheError("Unhandled Rejection at : " + reason);
});
