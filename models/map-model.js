const { model, Schema, ObjectId } = require('mongoose');

const mapSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
    children :{
      type:[String],
       required:true
    },
    name:{
      type: String,
      required: true
    },
    ownerId:{
      type:String,
      required:true
    }
		
	},
	{ timestamps: true }
);

const Map = model('Map', mapSchema);
module.exports = Map;