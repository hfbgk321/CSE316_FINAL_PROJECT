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