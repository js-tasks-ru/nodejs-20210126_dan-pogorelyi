const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options = {}) {
    super(options);

    this.limit = options.limit || 5;
    this.sizeByte = 0;
  }

  _transform(chunk, encoding, callback) {
    this.sizeByte += Buffer.byteLength(chunk.toString(), {encoding: 'utf-8'});

    if (this.sizeByte > this.limit) {
      return callback(new LimitExceededError());
    }

    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
