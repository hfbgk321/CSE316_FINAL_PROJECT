import {useQuery} from '@apollo/client';
import * as queries from '../cache/queries';



// export const isLoggedIn = async() =>{
//   // const {loading, error, data, refetch} = useQuery(queries.GET_DB_USER);
//   if(data) { 
//     let { getCurrentUser } = data;
//     if(getCurrentUser !== null) {
//        return {getCurrentUser,refetch};
//     }
//   }
//   return null;
// }