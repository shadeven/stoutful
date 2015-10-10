var PatchSchema = new sails.services.mongoose.Schema({ type: String }, {strict: false});
module.exports = sails.services.mongoose.model('Patch', PatchSchema);
