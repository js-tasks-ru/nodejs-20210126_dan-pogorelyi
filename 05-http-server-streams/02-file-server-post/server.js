const url = require("url");
const http = require("http");
const path = require("path");
const fs = require("fs");
const LimitSizeStream = require("./LimitSizeStream");

const server = new http.Server();
const MEGABYTE = 1048576;

server.on("request", (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const isSubFolders = pathname.split(path.sep).length > 1;

  switch (req.method) {
    case "POST":
      if (isSubFolders) {
        res.statusCode = 400;
        return res.end("Sub-folders aren't supported");
      }

      const filepath = path.join(__dirname, "files", pathname);
      const writeStream = fs.createWriteStream(filepath, { flags: "wx" });
      const limitSizeStream = new LimitSizeStream({ limit: MEGABYTE });
      let isAborted = false;

      function destroyWriteStream() {
        isAborted = true;
        writeStream.destroy();
      }

      req.pipe(limitSizeStream).pipe(writeStream);

      writeStream.on("error", (error) => {
        if (error.code === "EEXIST") {
          res.statusCode = 409;
          res.end("File is exist");
        }
      });

      writeStream.on("close", () => {
        if (isAborted) {
          fs.unlink(filepath, () => {});
        }
      });

      writeStream.on("finish", () => {
        res.statusCode = 201;
        res.end("It's all right");
      });

      limitSizeStream.on("error", () => {
        res.statusCode = 413;
        res.end("Large post request body");
        destroyWriteStream();
      });

      req.on("aborted", destroyWriteStream);

      break;

    default:
      res.statusCode = 501;
      res.end("Not implemented");
  }
});

module.exports = server;
