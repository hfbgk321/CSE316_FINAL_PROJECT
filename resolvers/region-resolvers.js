const ObjectId = require('mongoose').Types.ObjectId;
const Region = require('../models/region-model');
const Map = require('../models/map-model');



module.exports ={
  Query:{
    getRegionsByParentId: async (_,args,{res}) =>{
      let {parent_id} = args;
      let isMap = await Map.findById({_id:new ObjectId(parent_id)});  
      let arr = [];
      if(isMap){
        for(let x = 0; x < isMap.children.length;x++){
          let region = await Region.findById({_id: new ObjectId(isMap.children[x])});
          arr.push(region);
        }
        return arr;
      }
      let found = await Region.findById({_id: new ObjectId(parent_id) });
      if(found){
        for(let x = 0; x < found.children.length;x++){
          let region = await Region.findById({_id: new ObjectId(found.children[x])});
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
    },
    getAllLandmarks: async (_,args,{req}) =>{
      let landmarks = [];
      let regions = await Region.find({ownerId:new ObjectId(req.userId)});
      for(let x = 0; x< regions.length;x++){
        landmarks = [...landmarks,...regions[x].landmarks];
      }
      console.log(landmarks);
      return landmarks;
    },
    getChildren: async (_,args,{req}) =>{
      let {_id} = args;
      let region = await Region.findById({_id:_id});
      let children = [];
      for(let x = 0; x< region.children.length;x++){
        await getChildrenComponents(region.children[x],children);
      }
      return children;
    }
  }, 
  
  Mutation:{
    addSubregion: async (_,args,{req}) => {
      let {pos,subregion,arr,_id} = args;
      if(subregion._id.length == 0){
        let id = _id.length > 0 ? new ObjectId(_id): new ObjectId();
        subregion._id = id;
      }
      if(arr.length > 0){
        await remakeComponents(arr);
      }
      subregion.ownerId = new ObjectId(req.userId);
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

    addSubregionToMap: async (_,args,{req}) =>{
      let {pos,subregion,arr,_id} = args;
      let isNewSubregion = subregion._id.length > 0;
      if(arr.length > 0){
        await remakeComponents(arr);
      }
      
      
      if(!isNewSubregion){
        let id = _id.length > 0 ? new ObjectId(_id):  new ObjectId();
        subregion._id = id;
      }
      subregion.ownerId = new ObjectId(req.userId);
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
      let updated = await Region.findByIdAndUpdate({_id: new ObjectId(_id)},{[field]:value},{new:true,useFindAndModify:false});
      console.log(`_id: ${_id}, field: ${field}, value: ${value}`);
      console.log('updated: '+updated);
      return updated;
    },

    updateRegionChildren: async (_,args,{res}) =>{
      let {_id, children} = args;

      let updated = await Region.findByIdAndUpdate({_id:_id},{children:[...children]},{new:true});
      console.log(updated);
      return updated;
    },

    addLandmarkToRegion : async (_,args,{req}) =>{
      let {_id,landmark,pos} = args;
      let region = await Region.findById({_id:_id});
      let region_landmarks = region.landmarks;

      let new_landmark_arr = [];

      let added = false;

      for(let x = 0 ; x< region_landmarks.length;x++){
        if(x == pos){
          new_landmark_arr.push(landmark);
          new_landmark_arr.push(region_landmarks[x]);
          added = true;
        }else{
          new_landmark_arr.push(region_landmarks[x]);
        }
      }

      if(!added){
        new_landmark_arr.push(landmark);
      }

      let updated = await Region.findByIdAndUpdate({_id:_id},{landmarks:[...new_landmark_arr]},{new:true});
      if(updated){
        return updated;
      }
      return {};
    },

    deleteLandmarkFromRegion: async (_,args,{req}) =>{
      let {_id,pos} = args;
      let region = await Region.findById({_id:_id});
      let region_landmarks = region.landmarks;
      let new_region_landmarks = [];

      for(let x = 0; x< region_landmarks.length;x++){
        if(x == pos){
          continue;
        }
        new_region_landmarks.push(region_landmarks[x]);
      }

      let updated = await Region.findByIdAndUpdate({_id:_id},{landmarks:[...new_region_landmarks]},{new:true});
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
      
      let {_id,old_parent_id,new_parent_id} = args;
      let current_region = await Region.findById({_id:_id});

      let current_parent = current_region.isParentAMap ? await Map.findById({_id:old_parent_id}): await Region.findById({_id:old_parent_id});
      


      current_parent.children = deleteChildrenFromArray(_id,current_parent.children);
      

      let new_parent = await Region.findById({_id:new_parent_id});
      let isMap = false;
      if(!new_parent){
        new_parent = await Map.findById({_id:new_parent_id});
        isMap = true;
      }

      current_region.parent_id = new_parent_id;
      current_region.isParentAMap = isMap;
      if(isMap){
        current_region.map = new_parent_id;
      }


      if(old_parent_id!==new_parent_id){
        new_parent.children.push(_id);
      }

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







