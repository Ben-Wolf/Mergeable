var mongoose = require('mongoose');

// Document Schema
var documentSchema = mongoose.Schema ({
  owner: {
    type: String
  },
  title: {
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
  description: {
    type: String
  },
  otherEditors: {
    type: [String]
  },
  language: {
    type: String
  },
  hidden: {
    type: Boolean
  }
});

var Document = module.exports = mongoose.model('Document', documentSchema);

module.exports.createDocument = function(newDocument, callback){
  newDocument.save(callback);
}

module.exports.getDocumentById = function(id, callback){
  Document.findById(id, callback);
}

module.exports.removeDocumentById = function(id, callback){
  Document.findByIdAndRemove(id, callback);
}
