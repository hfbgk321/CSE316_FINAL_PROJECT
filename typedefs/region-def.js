const { gql } = require('apollo-server');

const typeDefs = gql `
	type Region {
		_id: String
		children:[Int!]
    name:String
    captial:String
    leader:String
    flag:String
    landmarks:[String]
    parent_id:String
	}
	extend type Query {
    getRegionById(_id:String!): Region
    getRegionByParentId(parent_id:String!): Region
    getAllRegions:[Region!]

	}
	extend type Mutation {
    addSubregion(_id: String!, subregion: RegionInput): String!
    deleteSubregion(_id:String!, subregion_id: String!):Boolean
    updateSubregionField(subregion_id: String!, field:String!, value:String!): String
    updateParentRegion(currentParentId:String!, newParentId: String!, _id:String!): String

	},
  input RegionInput {
	_id: String
	children: [Int]
	name: String
	capital: String
	leader:String
	flag: String
	landmarks: [String]
	parent_id: String
}

`;

module.exports = { typeDefs: typeDefs }