const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);

    this.separator = os.EOL;
    this.line = '';
  }

  _transform(chunk, encoding, callback) {
    this.line += chunk.toString();

    const pieces = this.line.split(this.separator);

    this.line = pieces.pop();

    pieces.forEach((item) => this.push(item));

    callback();
  }

  _flush(callback) {
    if (this.line) {
      this.push(this.line);
    }

    callback();
  }
}

module.exports = LineSplitStream;

