const { gql } = require('apollo-server');

const typeDefs = gql `
	type Map {
		_id: String
		children: [String]
    name:String
    ownerId:String
	}
	extend type Query {
		getAllMaps : [Map]
    getMapById(_id:String):Map  

	}
	extend type Mutation {
		addNewMap(map: MapInput): Map!
    deleteMap(_id:String): Boolean
    updateMapName(_id:String!, name: String!): String

	},

	input MapInput {
	_id: String
	children: [String]
	name: String
	ownerId : String
}

`;

module.exports = { typeDefs: typeDefs }