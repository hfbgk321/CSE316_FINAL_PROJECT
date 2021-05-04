import {gql} from "@apollo/client";


export const LOGIN = gql`
  mutation Login($email:String!, $password:String!){
    login(email:$email,password:$password){
      email
      _id
      name
      password
    }
  }
`;


export const REGISTER = gql`
  mutation Register($email: String!, $password:String!, $name:String!){
    register(email:$email, password:$password, name:$name){
      email
      password
      name
    }
  }
`;


export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export const UPDATE = gql`
  mutation Update($email:String!, $current_password:String!, $new_password:String!,$name:String!){
    update(email:$email,current_password:$current_password,new_password:$new_password,name:$name){
      email
      password
      name
    }
  } 
`;

export const CREATE_MAP = gql`
  mutation AddNewMap($map: MapInput){
    addNewMap(map:$map){
      _id
	    children
	    name
	    ownerId
    }
  }
`;

export const ADD_NEW_REGION = gql`
  mutation AddSubregion($pos:Int,$subregion: RegionInput,$arr:[RegionInput]){
    addSubregion(pos:$pos,subregion: $subregion,arr:$arr){
      _id
		  children
      name
      capital
      leader
      flag
      landmarks
      parent_id
      isParentAMap
      map
    }
  }
`;

export const ADD_NEW_REGION_TO_MAP = gql`
  mutation AddSubregionToMap($pos:Int,$subregion:RegionInput,$arr:[RegionInput]){
    addSubregionToMap(pos:$pos,subregion:$subregion,arr:$arr){
      _id
		  children
      name
      capital
      leader
      flag
      landmarks
      parent_id
      isParentAMap
      map
    }
  }
`;

export const DELETE_MAP = gql`
  mutation DeleteMap($_id:String){
    deleteMap(_id:$_id)
  }
`;

export const DELETE_SUBREGION = gql`
  mutation DeleteSubregion($_id:String){
    deleteSubregion(_id:$_id){
      _id
			children
    	name
    	capital
    	leader
    	flag
    	landmarks
    	parent_id
			isParentAMap
      map
    }
  }
`;

export const UPDATE_SUBREGION_FIELD = gql`
  mutation UpdateSubregionField($_id:String,$field:String,$value:String){
    updateSubregionField(_id:$_id,field:$field,value:$value){
      _id
		  children
      name
      capital
      leader
      flag
      landmarks
      parent_id
      isParentAMap
      map
    }
  }
`;

export const UPDATE_MAP_NAME = gql`
  mutation UpdateMapName($_id:String!, $name: String!){
    updateMapName(_id:$_id,name:$name){
      _id
	    children
	    name
	    ownerId
    }
  }
`;


export const UPDATE_MAP_CHILDREN = gql`
  mutation UpdateMapChildren($_id:String, $children: [String]){
    updateMapChildren(_id:$_id,children:$children){
      _id
	    children
	    name
	    ownerId
    }
  }
`;


export const UPDATE_REGION_CHILDREN = gql`
  mutation UpdateRegionChildren($_id:String,$children:[String]){
    updateRegionChildren(_id:$_id,children:$children){
      _id
		  children
      name
      capital
      leader
      flag
      landmarks
      parent_id
      isParentAMap
      map
    }
  }
`;

export const ADD_LANDMARK_TO_REGION = gql`
  mutation AddLandmarkToRegion($_id:String,$landmark:String,$pos:Int){
    addLandmarkToRegion(_id:$_id,landmark:$landmark,pos:$pos){
      _id
		  children
      name
      capital
      leader
      flag
      landmarks
      parent_id
      isParentAMap
      map
    }
  }
`;

export const CHANGE_LANDMARK_AT_POS = gql`
  mutation ChangeLandmarkAtPos($_id:String,$new_landmark:String,$pos:Int){
    changeLandmarkAtPos(_id:$_id,new_landmark:$new_landmark,pos:$pos){
      _id
		  children
      name
      capital
      leader
      flag
      landmarks
      parent_id
      isParentAMap
      map
    }
  }

`;

export const CHANGE_PARENT = gql`
  mutation ChangeParent($_id:String,$old_parent_id:String,$new_parent_id:String){
    changeParent(_id:$_id,old_parent_id:$old_parent_id,new_parent_id:$new_parent_id){
      _id
		  children
      name
      capital
      leader
      flag
      landmarks
      parent_id
      isParentAMap
      map
    }
  }
`;





