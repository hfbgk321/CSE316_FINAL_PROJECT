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
			isParentAMap
			map
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
			isParentAMap
			map
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

export const GET_ALL_REGIONS_EXCEPT_CURRENT = gql`
  query GetAllRegionsExceptCurrent($_id:String){
		getAllRegionsExceptCurrent(_id:$_id){
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


export const GET_ALL_LANDMARKS = gql`
	query GetAllLandmarks{
		getAllLandmarks
	}
`;

export const GET_CHILDREN = gql`
	query GetChildren($_id:String){
		getChildren(_id:$_id){
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