var mongoose = require('mongoose');

// Document Schema
var documentSchema = mongoose.Schema ({
  owner: {
    type: String
  },
  dateCreated: {
    type: Date
  },
  lastModified: {
    type: Date
  },
  file: {
    type: String
  },
  otherEditors: {
    type: [String]
  }
});

var Document = module.exports = mongoose.model('Document', documentSchema);
