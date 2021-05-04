const ObjectId = require('mongoose').Types.ObjectId;
const Region = require('../models/region-model');
const Map = require('../models/map-model');



module.exports ={
  Query:{
    getRegionsByParentId: async (_,args,{res}) =>{
      let {parent_id} = args;
      let isMap = await Map.findById({_id:parent_id});  
      let arr = [];
      if(isMap){
        for(let x = 0; x < isMap.children.length;x++){
          let region = await Region.findById({_id:isMap.children[x]});
          arr.push(region);
        }
        return arr;
      }
      let found = await Region.findById({_id: parent_id });
      if(found){
        for(let x = 0; x < found.children.length;x++){
          let region = await Region.findById({_id:found.children[x]});
          arr.push(region);
        }
        return arr;
      }
      return [];
    },
    getRegionById : async (_,args,{res}) =>{
      let {_id} = args;
      let obj_id = new ObjectId(_id);
      let map = await Region.findById({_id:obj_id});
      if(map) return map;
      return {};
    },
    getRegionPaths : async (_,args,{res}) =>{
      let {_id} = args;
      let map = await Map.findById({_id:new ObjectId(_id)});
      if(map) return [];
      let arr = [];
      await previousPaths(_id,arr);
      return arr;
    },
    getAllRegionsExceptCurrent: async (_,args,{req}) =>{
      let {_id} = args;
      let maps = await Map.find({ownerId:new ObjectId(req.userId)});
      let arr = [];

      for(let x =0; x< maps.length;x++){
        let current_map = maps[x];
        for(let y = 0; y < current_map.children.length;y++){
          await allRegionsExceptThis(current_map.children[y],_id,arr);
        }
      }
      return arr;
    }
  }, 
  
  Mutation:{
    addSubregion: async (_,args,{res}) => {
      let {pos,subregion,arr} = args;
      if(subregion._id.length == 0){
        let _id = new ObjectId();
        subregion._id = _id;
      }
      if(arr.length > 0){
        await remakeComponents(arr);
      }
      
      let region = new Region(subregion);
      let parent_id = new ObjectId(region.parent_id);
      let parent_region = await Region.findById({_id:parent_id});

      let children_arr = parent_region.children;
      let temp_arr = [];
      if(pos === children_arr.length){
        temp_arr = [...children_arr,region._id];
      }else{
        for(let x = 0; x< children_arr.length;x++){
          if(pos === x){
            temp_arr.push(region._id);
            temp_arr.push(children_arr[x]);
          }else{
            temp_arr.push(children_arr[x]);
          }
        }
      }
      

      await Region.findByIdAndUpdate({_id:parent_id},{children:[...temp_arr]});
      let saved = await region.save();
      return saved;
    },

    addSubregionToMap: async (_,args,{res}) =>{
      let {pos,subregion,arr} = args;
      let isNewSubregion = subregion._id.length > 0;
      if(arr.length > 0){
        await remakeComponents(arr);
      }
      
      
      if(!isNewSubregion){
        let _id = new ObjectId();
        subregion._id = _id;
      }
      
      let region = new Region(subregion);
      let parent_id = new ObjectId(region.parent_id);
      let parent_region = await Map.findById({_id:parent_id});

      let children_arr = parent_region.children;
      
      let temp_arr = [];
      if(pos === children_arr.length){
        temp_arr = [...children_arr,region._id];
      }else{
        for(let x = 0; x< children_arr.length;x++){
          if(pos === x){
            temp_arr.push(region._id); 
            temp_arr.push(children_arr[x]);
          }else{
            temp_arr.push(children_arr[x]);
          }
        }
      }
      await Map.findByIdAndUpdate({_id:parent_id},{children:[...temp_arr]},{new:true});
      let saved = await region.save();
      console.log(saved);
      return saved;
    },

    deleteSubregion: async (_,args,{res}) =>{
      let {_id} = args;

      let currentRegion = await Region.findById({_id: _id});
      let saved_data = [];
      if(currentRegion.isParentAMap){
        let map = await Map.findById({_id:currentRegion.parent_id});
        for(let x  = 0; x< currentRegion.children.length;x++){
          await getChildrenComponents(currentRegion.children[x],saved_data);
        }
        let new_children = deleteChildrenFromArray(currentRegion._id,map.children);
        let updated_parent = await Map.findByIdAndUpdate({_id:currentRegion.parent_id},{children:new_children});
      }else{
        let region = await Region.findById({_id:currentRegion.parent_id});
        for(let x  = 0; x< currentRegion.children.length;x++){
          await getChildrenComponents(currentRegion.children[x],saved_data);
        }
        let new_children = deleteChildrenFromArray(currentRegion._id,region.children);
        let updated_parent = await Region.findByIdAndUpdate({_id:currentRegion.parent_id},{children:new_children});
      }
      
      let deleted = await deleteChildComponents(_id);
      if(deleted == "done"){
        return saved_data;
      }
      return [];
    },

    updateSubregionField: async (_,args,{res}) =>{
      let {_id,field,value} = args;
      let updated = await Region.findByIdAndUpdate({_id,_id},{[field]:value},{new:true});
      return updated;
    },

    updateRegionChildren: async (_,args,{res}) =>{
      let {_id, children} = args;

      let updated = await Region.findByIdAndUpdate({_id:_id},{children:[...children]},{new:true});
      return updated;
    },

    addLandmarkToRegion : async (_,args,{res}) =>{
      let {_id,landmark} = args;
      let region = await Region.findById({_id:_id});
      let region_landmarks = region.landmarks;

      let updated = await Region.findByIdAndUpdate({_id:_id},{landmarks:[...region_landmarks,landmark]},{new:true});
      if(updated){
        return updated;
      }
      return {};
    },

    changeLandmarkAtPos: async (_,args,{res}) =>{
      let {_id,new_landmark,pos} = args;

      let region = await Region.findById({_id:_id});
      let region_landmarks = region.landmarks;

      region_landmarks[pos] = new_landmark;

      let updated = await Region.findByIdAndUpdate({_id:_id},{landmarks:[...region_landmarks]},{new:true});
      if(updated){
        return updated;
      }
      return {};
    },
    changeParent: async (_,args,{res}) =>{
      //_id:String,old_parent:String,new_parent:String
      /**
         * Find the region who wants to change its parent
         * Find the current parent of that region.
         * delete the region's _id from the current parent's children 
         * change the parent_id of the region to the new parent id
         * 
         * find the new parent of the region.
         * add the current region's _id to the new parent's children's property
         * 
       */
      //name: layer1 - c _id: 608e15874b2350110cba6407
      //old_parent: 608e0989397a79287cc55ff7
      //new_parent: 608e0b97397a79287cc55fff -> layer 1
      let {_id,old_parent_id,new_parent_id} = args;
      console.log("_id: "+_id);
      console.log("old_parent: "+old_parent_id);
      console.log("new_parent: "+new_parent_id);
      let current_region = await Region.findById({_id:_id});

      console.log("current_region: " );
      console.log(current_region);

      let current_parent = current_region.isParentAMap ? await Map.findById({_id:old_parent_id}): await Region.findById({_id:old_parent_id});
      
      console.log("current_parent: " );
      console.log(current_parent);

      current_parent.children = deleteChildrenFromArray(_id,current_parent.children);
      

      let new_parent = await Region.findById({_id:new_parent_id});
      let isMap = false;
      if(!new_parent){
        new_parent = await Map.findById({_id:new_parent_id});
        isMap = true;
      }

      current_region.parent_id = new_parent_id;
      current_region.isParentAMap = isMap;
      console.log("updated current region");
      console.log(current_region);

      if(old_parent_id!==new_parent_id){
        new_parent.children.push(_id);
      }
      
      console.log("new parent");
      console.log(new_parent);

      await new_parent.save();
      await current_region.save();
      await current_parent.save();
      
      return current_region;
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

const previousPaths = async (_id,arr) =>{
  let region = await Region.findById({_id:_id});
  
  if(region.isParentAMap){
    let map = await Map.findById({_id:region.parent_id});
    arr.unshift({_id: region.parent_id,name:map.name});
    return;
  }
  let parent_region = await Region.findById({_id:region.parent_id});
  arr.unshift({_id:region.parent_id,name:parent_region.name});

  return await previousPaths(region.parent_id,arr);
  
}


const getChildrenComponents = async (_id,arr) =>{
  let region = await Region.findById({_id:_id});
  arr.push(region);
  for(let x = 0; x< region.children.length;x++){
    await getChildrenComponents(region.children[x],arr);
  }
  return arr;
}

const remakeComponents = async (arr) =>{
  for(let x = 0; x< arr.length;x++){
    let region = new Region(arr[x]);
    await region.save();
  }
}

const allRegionsExceptThis = async (starting_id,excluded_id,arr) =>{
  if(starting_id === excluded_id){
    return;
  }else{
    let current_region = await Region.findById({_id:starting_id});
    arr.push(current_region);
    for(let x = 0; x< current_region.children.length;x++){
      await allRegionsExceptThis(current_region.children[x],excluded_id,arr);
    }
    return;
  }
}








