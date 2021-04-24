const { model, Schema, ObjectId } = require('mongoose');

const regionSchema = new Schema(
	{
		_id: {
			type: ObjectId,
			required: true
		},
    children:{
      type:[String],
      required:true
    },
    name:{
      type:String,
      required:true
    },
    capital:{
      type:String,
      required:true
    },
    leader:{
      type:String,
      required:true
    },
    flag:{
      type:String,
      required:true
    },
    landmarks:{
      type:[String],
      required:true
    },
    parent_id:{
      type:String,
      required:true
    },
    isParentAMap:{
      type:Boolean,
      required:true
    }
	
	},
	{ timestamps: true }
);

const Region = model('Region', regionSchema);
module.exports = Region;