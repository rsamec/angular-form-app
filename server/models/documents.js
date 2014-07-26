var mongoose = require('mongoose');
var Schema = mongoose.Schema

module.exports = mongoose.model('docs', new Schema( {
    formId: String,
    updated: { type: Date, default: Date.now },
    data :  Schema.Types.Mixed
}));