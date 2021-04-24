const ObjectId = require('mongoose').Types.ObjectId;
const Region = require('../models/region-model');
const Map = require('../models/map-model');



module.exports ={
  Query:{
    getRegionsByParentId: async (_,args,{res}) =>{
      let {parent_id} = args;
      let found = await Region.find({parent_id: parent_id });
      if(found) return found;
      return [];
    },
    getRegionById : async (_,args,{res}) =>{
      let {_id} = args;
      let obj_id = new ObjectId(_id);
      let map = await Region.findById({_id:obj_id});
      if(map) return map;
      return {};
    }
  },
  Mutation:{
    addSubregion: async (_,args,{res}) => {
      let {subregion} = args;
      let _id = new ObjectId();
      subregion._id = _id;
      let region = new Region(subregion);
      let parent_id = new ObjectId(region.parent_id);
      let parent_region = await Region.findById({_id:parent_id});

      let children_arr = parent_region.children;
      let updated = await Region.findByIdAndUpdate({_id:parent_id},{children:[...children_arr,region._id]});
      let saved = await region.save();
      console.log(saved);
      return saved;
    },

    addSubregionToMap: async (_,args,{res}) =>{
      let {subregion} = args;
      let _id = new ObjectId();
      subregion._id = _id;
      let region = new Region(subregion);
      let parent_id = new ObjectId(region.parent_id);
      let parent_region = await Map.findById({_id:parent_id});

      let children_arr = parent_region.children;
      let updated = await Map.findByIdAndUpdate({_id:parent_id},{children:[...children_arr,region._id]});
      let saved = await region.save();
      console.log(saved);
      return saved;
    },

    deleteSubregion: async (_,args,{res}) =>{
      let {subregion_id} = args;

      let currentRegion = await Region.findById({_id: subregion_id});
      if(currentRegion.isParentAMap){
        let map = await Map.findById({_id:currentRegion.parent_id});
        let new_children = deleteChildrenFromArray(currentRegion._id,map.children);
        let updated_parent = await Map.findByIdAndUpdate({_id:currentRegion.parent_id},{children:new_children});
      }else{
        let region = await Region.findById({_id:currentRegion.parent_id});
        let new_children = deleteChildrenFromArray(currentRegion._id,region.children);
        let updated_parent = await Region.findByIdAndUpdate({_id:currentRegion.parent_id},{children:new_children});
      }
      
      let deleted = await deleteChildComponents(subregion_id);
      if(deleted == "done"){
        return true;
      }
      return false;
    }
  }
}

const deleteChildComponents = async (_id) =>{
    let curr_region = await Region.findById(new ObjectId(_id));
    let deleted = await Region.findByIdAndDelete(_id);
    if(deleted){
      for(let x = 0; x< curr_region.children.length;x++){
        await deleteChildComponents(curr_region.children[x]);
      }
    }
    return "done";
}

const deleteChildrenFromArray = (_id,arr) =>{
  let altered_arr = [];

  for(let x = 0; x< arr.length;x++){
    if(arr[x] == _id) continue;
    altered_arr.push(arr[x]);
  }
  return altered_arr;
}





