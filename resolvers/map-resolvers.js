const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');



module.exports ={
  Query:{
    getAllMaps: async (_,__,{req}) =>{
      const _id = new ObjectId(req.userId);
      if(!_id) return ([]);
      const maps = await Map.find({ownerId: _id});
      if(maps) return (maps); 
    }
  },
  Mutation:{
    addNewMap: async (_,args,{req}) =>{
      let {map} = args;
      console.log(map);
      let ownerId = new ObjectId(req.userId);
      let _id = new ObjectId();
      map.ownerId = ownerId;
      map._id = _id;
      let new_map = new Map(map);

      const saved = await new_map.save();
      console.log(saved);
      return saved;
    }
  }
}