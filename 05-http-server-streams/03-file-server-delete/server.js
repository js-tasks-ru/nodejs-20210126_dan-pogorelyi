const url = require("url");
const http = require("http");
const path = require("path");
const fs = require("fs");

const server = new http.Server();

server.on("request", (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const isSubFolders = pathname.split(path.sep).length > 1;

  switch (req.method) {
    case "DELETE":
      if (isSubFolders) {
        res.statusCode = 400;
        return res.end("Sub-folders aren't supported");
      }

      const filepath = path.join(__dirname, "files", pathname);

      fs.unlink(filepath, (error) => {
        if (error) {
          if (error.code === "ENOENT") {
            res.statusCode = 404;
            res.end("File not found");
          }
        } else {
          res.statusCode = 200;
          res.end("File was deleted");
        }
      });

      break;

    default:
      res.statusCode = 501;
      res.end("Not implemented");
  }
});

module.exports = server;
