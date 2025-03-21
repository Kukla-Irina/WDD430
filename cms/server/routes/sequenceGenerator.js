var Sequence = require("../models/sequence");

function SequenceGenerator() {
  this.maxDocumentId = null;
  this.maxMessageId = null;
  this.maxContactId = null;
  this.sequenceId = null;

  // Initialize the sequence values
  this.initialize();
}

SequenceGenerator.prototype.initialize = function () {
  Sequence.findOne().exec((err, sequence) => {
    if (err) {
      console.error("Error initializing sequence:", err);
      return;
    }

    this.sequenceId = sequence._id;
    this.maxDocumentId = sequence.maxDocumentId;
    this.maxMessageId = sequence.maxMessageId;
    this.maxContactId = sequence.maxContactId;
  });
};

SequenceGenerator.prototype.nextId = async function (collectionType) {
  let updateObject = {};
  let nextId;

  switch (collectionType.toLowerCase()) {
    case "documents":
      this.maxDocumentId++;
      updateObject = { maxDocumentId: this.maxDocumentId };
      nextId = this.maxDocumentId;
      break;
    case "messages":
      this.maxMessageId++;
      updateObject = { maxMessageId: this.maxMessageId };
      nextId = this.maxMessageId;
      break;
    case "contacts":
      this.maxContactId++;
      updateObject = { maxContactId: this.maxContactId };
      nextId = this.maxContactId;
      break;
    default:
      return -1;
  }

  try {
    await Sequence.updateOne({ _id: this.sequenceId }, { $set: updateObject });
    return nextId;
  } catch (err) {
    console.error("Error updating sequence:", err);
    throw err;
  }
};

module.exports = new SequenceGenerator();