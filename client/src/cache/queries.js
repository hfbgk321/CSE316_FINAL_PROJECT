import { gql } from "@apollo/client";

export const GET_DB_USER = gql`
	query GetDBUser {
		getCurrentUser {
			_id
			name
			email
		}
	}
`;


export const GET_ALL_MAPS = gql`
  query GetAllMaps {
		getAllMaps {
			_id
			children
    	name
    	ownerId
		}
	}
`;



export const GET_SUBREGION_BY_ID = gql`
	query GetRegionsByParentId($parent_id:String!){
		getRegionsByParentId(parent_id:$parent_id){
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


export const GET_MAP_BY_ID = gql`
	query GetMapById($_id:String){
		getMapById(_id:$_id){
			_id
			children
    	name
    	ownerId
		}
	}
`;

export const GET_REGION_BY_ID = gql`
	query GetRegionById($_id:String){
		getRegionById(_id:$_id){
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

export const GET_PREVIOUS_PATHS = gql`
	query GetRegionPaths($_id:String){
		getRegionPaths(_id:$_id){
			name
    _id
		}
	}
`;