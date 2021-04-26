const { gql } = require('apollo-server');

const typeDefs = gql `
	type Region {
		_id: String
		children:[String]
    name:String
    capital:String
    leader:String
    flag:String
    landmarks:[String]
    parent_id:String
		isParentAMap: Boolean
	}
	extend type Query {
    getRegionById(_id:String): Region
    getRegionsByParentId(parent_id:String!): [Region]
    getAllRegions:[Region!]
		getRegionPaths(_id:String):[PathInfo]

	}
	extend type Mutation {
    addSubregion(subregion: RegionInput): Region
    deleteSubregion(_id: String):Boolean
    updateSubregionField(_id: String, field:String, value:String): Region
    updateParentRegion(currentParentId:String!, newParentId: String!, _id:String!): String
		addSubregionToMap(subregion:RegionInput): Region
	},
  input RegionInput {
	_id: String
	children: [String]
	name: String
	capital: String
	leader:String
	flag: String
	landmarks: [String]
	parent_id: String
	isParentAMap: Boolean
},
type PathInfo {
	_id:String
	name:String
}
`;

module.exports = { typeDefs: typeDefs }