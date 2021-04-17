import {gql} from 'apollo-server';
const userDef = require('./user-def').typeDefs;
const regionDef = require('./region-def').typeDefs;
const mapDef = require('./map-def').typeDefs;
const rootDef = gql`
  type Query{
    _empty:String
  }

  type Mutation{
    _empty: String
  }
`;

module.exports ={
  typeDefs:[rootDef,userDef,regionDef,mapDef]//add more as you make more.
}