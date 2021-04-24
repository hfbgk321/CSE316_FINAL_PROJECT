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
  mutation Update($email:String!, $current_password:String!, $new_password:String!){
    update(email:$email,current_password:$current_password,new_password:$new_password){
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
  mutation AddSubregion($subregion: RegionInput){
    addSubregion(subregion: $subregion){
      _id
		  children
      name
      capital
      leader
      flag
      landmarks
      parent_id
    }
  }
`;

export const ADD_NEW_REGION_TO_MAP = gql`
  mutation AddSubregionToMap($subregion:RegionInput){
    addSubregionToMap(subregion:$subregion){
      _id
		  children
      name
      capital
      leader
      flag
      landmarks
      parent_id
    }
  }
`;

export const DELETE_MAP = gql`
  mutation DeleteMap($_id:String){
    deleteMap(_id:$_id)
  }
`;


