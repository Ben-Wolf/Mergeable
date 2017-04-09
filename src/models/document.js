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
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User'
  }
});

var Document = module.exports = mongoose.model('Document', documentSchema);
