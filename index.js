import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {} from 'apollo-server-express';
import {serverOptions} from './server-config';
const resolvers = require('./resolvers/root-resolver');
const { typeDefs }  = require('./typedefs/root-def');
import {ApolloServer} from 'apollo-server-express';
require('dotenv').config();
const { MONGO_URI, BACKEND_PORT, CLIENT_LOCAL_ORIGIN, SERVER_LOCAL_DOMAIN } = process.env;
const app = express();


app.use(cors({origin: CLIENT_LOCAL_ORIGIN, credentials: true }));

const corsPolicy = async(req, res, next) => {
  /*
      TODO for 316 students: res.set(), Access-Control-Allow-Origin and Access-Control-Allow-Credentials headers,
      have them set these, inspect error messages, understand why they're needed
  */
 if(req.headers.origin){
  res.set("Access-Control-Allow-Origin", req.headers.origin.toString());
  res.set("Access-Control-Allow-Credentials", true);
 }

next();
}



app.options('*', cors());
app.use(corsPolicy);
serverOptions(app);

const server = new ApolloServer({
  typeDefs: typeDefs,
resolvers: resolvers,
context: ({req, res}) => ({ req, res })
});

// since the express server has cors configured, cors on the apollo server
// can be false; passing the same options as defined on the express instance
// works as well
server.applyMiddleware({ app , cors: false});

mongoose.connect(MONGO_URI,{useNewUrlParser: true, useUnifiedTopology:true}).then(()=>{
  app.listen({port: BACKEND_PORT},CLIENT_LOCAL_ORIGIN,()=>{
    console.log(`Backend server ready at ${SERVER_LOCAL_DOMAIN}:${BACKEND_PORT}`);
  })
}).catch(err =>{
  console.log(err);
})
