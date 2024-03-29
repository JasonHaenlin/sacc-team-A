const { logTheTransaction } = require("./config/logger");

module.exports = {
  logErrors(err, req, res, next) {
    /* log the error using winston for all production errors */
    logTheTransaction(
      req.ip,
      `${err.status || 500} - ${err.name} -${err.message} - ${
        req.originalUrl
      } - ${req.method}`,
      "error"
    );
    next(err);
  },

  handleClientErrors: async (err, req, res, next) => {
    let message = "something went wrong";
    if (process.env.NODE_ENV !== "production") {
      message = err.stack || err;
    }
    if (err.name.toLowerCase() !== "error") {
      res
        .status(err.status || 400)
        .json({ code: err.status, message: message });
    } else {
      next(err);
    }
  },

  handleDevErrors: async (err, req, res, next) => {
    if (process.env.NODE_ENV !== "production") {
      return res.status(500).json({ code: 500, stack: err.stack || err });
    }
    res.status(500).json({ code: 500, message: "something went wrong" });
  },

  /* this is for handling 404 err */
  handle404Error: async (req, res) => {
    res.status(404).json({ code: 404, message: "please check URL" });
  },

  /* centralizing all the errors */
  handleExceptions: (fn) => (req, res, next) => {
    fn(req, res, next).catch((err) => next(err));
  },
};
