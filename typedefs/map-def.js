const { gql } = require('apollo-server');

const typeDefs = gql `
	type Map {
		_id: String
		children: [Int!]
    name:String
    ownerId:String
	}
	extend type Query {
		getAllMaps : [Map]
    getMapById(_id:String!):Map  

	}
	extend type Mutation {
		addNewMap(map: MapInput): String!
    deleteMap(_id:String!): Boolean
    updateMapName(_id:String!, name: String!): String

	},

	input MapInput {
	_id: String
	children: [Int]
	name: String
	ownerid : String
}

`;

module.exports = { typeDefs: typeDefs }