const ObjectId = require('mongoose').Types.ObjectId;
const Map = require('../models/map-model');
const Region = require('../models/region-model');



module.exports ={
  Query:{
    getAllMaps: async (_,__,{req}) =>{
      const _id = new ObjectId(req.userId);
      if(!_id) return ([]);
      const maps = await Map.find({ownerId: _id});
      maps.sort((a,b) => a.access_id - b.access_id);
      if(maps) return (maps); 
    },
    getMapById: async (_,args,{req}) =>{
      let {_id} = args;
      let obj_id = new ObjectId(_id);
      let current_map = await Map.findById({_id:obj_id});
      let all_maps = await Map.find({ownerId: new ObjectId(req.userId)});
      if(all_maps.length == 1) {
        current_map;
      }

      all_maps.sort((a,b) => a.access_id - b.access_id);

      if(current_map){
        let current_map_access_id = current_map.access_id;

        let most_recently_accessed_map = await Map.findOneAndUpdate({_id:all_maps[0]._id},{access_id:current_map_access_id},{new:true});

        current_map.access_id = all_maps[0].access_id;
        let updated = await current_map.save();

        return current_map;
      }
      return {};
    }
  },
  Mutation:{
    addNewMap: async (_,args,{req}) =>{
      let {map} = args;

      let ownerId = new ObjectId(req.userId);
      let _id = new ObjectId();
      map.ownerId = ownerId;
      map._id = _id;

      let all_maps = await Map.find({ownerId:ownerId});
      all_maps.sort((a,b) => a.access_id - b.access_id);
      
      if(all_maps.length === 0){
        map.access_id = 0;
      }else{
        map.access_id = all_maps[all_maps.length-1].access_id+1;
      }
      
      let new_map = new Map(map);

      const saved = await new_map.save();
      return saved;
    },
    deleteMap: async (_,args,{req}) =>{
      let {_id} = args;
      let current_map = await Map.findById({_id:new ObjectId(_id)});
      let children = current_map.children;
      let deleted = await Map.findByIdAndDelete({_id:new ObjectId(_id)});
    
      for(let x = 0; x< children.length;x++){
        await deleteChildComponents(children[x]);
      }
      return true;
    },
    updateMapName: async (_,args,{req}) =>{
      let {_id,name} = args;
      let map = await Map.findByIdAndUpdate({_id:_id},{name:name},{new:true});
      if(map) return map;
      return {};
    },
    updateMapChildren: async (_,args,{req}) =>{
      let {_id, children} = args;
      let map = await Map.findByIdAndUpdate({_id:_id},{children:[...children]},{new:true});
      return map;
    }
  }
}

const deleteChildComponents = async (_id) =>{
  let id = new ObjectId(_id);
  let curr_region = await Region.findById({_id:id});
  let deleted = await Region.findByIdAndDelete({_id:id});
  if(deleted){
    for(let x = 0; x< curr_region.children.length;x++){
      await deleteChildComponents(curr_region.children[x]);
    }
  }
  return true;
}


