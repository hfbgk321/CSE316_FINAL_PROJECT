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
        console.log(isMap);
        console.log("parent is a map");
        for(let x = 0; x < isMap.children.length;x++){
          let region = await Region.findById({_id:isMap.children[x]});
          arr.push(region);
        }
        console.log(arr);
        return arr;
      }

      // console.log("parent is not a map");

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
    }
  },
  Mutation:{
    addSubregion: async (_,args,{res}) => {
      console.log("is not a map");
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
      

      let updated = await Region.findByIdAndUpdate({_id:parent_id},{children:[...temp_arr]});
      let saved = await region.save();
      console.log(saved);
      return saved;
    },

    addSubregionToMap: async (_,args,{res}) =>{
      
      console.log("ismap");
      let {pos,subregion,arr} = args;
      let isNewSubregion = subregion._id.length > 0;
      console.log("------------------arr");
      console.log(arr);
      console.log("------------------arr");
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
      console.log("----------------------------------------");
      console.log(children_arr);
      console.log(temp_arr);
      console.log("----------------------------------------");

      let updated = await Map.findByIdAndUpdate({_id:parent_id},{children:[...temp_arr]},{new:true});
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
  // console.log("---------------------getdchild");
  // console.log(arr);
  // console.log("---------------------getdchild");
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

// console.log(getChildrenComponents())





