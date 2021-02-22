const url = require("url");
const http = require("http");
const path = require("path");
const fs = require("fs");

const server = new http.Server();

server.on("request", (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const isSubFolders = pathname.split(path.sep).length > 1;

  switch (req.method) {
    case "GET":
      if (isSubFolders) {
        res.statusCode = 400;
        return res.end("Sub-folders aren't supported");
      }

      const filepath = path.join(__dirname, "files", pathname);
      const stream = fs.createReadStream(filepath);

      stream.pipe(res);
      stream.on("error", (error) => {
        if (error.code === "ENOENT") {
          res.statusCode = 404;
          return res.end("File not found");
        }

        res.statusCode = 500;
        return res.end("Server error");
      });

      req.on("aborted", () => stream.destroy());

      break;

    default:
      res.statusCode = 501;
      return res.end("Not implemented");
  }
});

module.exports = server;
