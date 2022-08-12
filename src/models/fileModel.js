const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
    },
    storagePath: {
      type: String,
      required: true,
    },
    sizeMegabytes: {
      type: Number,
    },
    parentFile: {
      type: mongoose.Schema.ObjectId,
      ref: 'File',
    },
    isFolder: {
      type: Boolean,
      required: true,
    },
    isPrivate: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const File = mongoose.model('File', FileSchema);

module.exports = File;
