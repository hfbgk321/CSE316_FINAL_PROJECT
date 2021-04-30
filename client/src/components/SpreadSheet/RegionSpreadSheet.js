import react,{useState,useEffect} from 'react';
import {Table,Container,Row,Col,Button} from 'react-bootstrap';
import {useParams} from 'react-router-dom';
import {useQuery,useMutation} from "@apollo/client";
import * as queries from '../../cache/queries';
import {ADD_NEW_REGION,ADD_NEW_REGION_TO_MAP,DELETE_SUBREGION,UPDATE_SUBREGION_FIELD,UPDATE_MAP_CHILDREN,UPDATE_REGION_CHILDREN} from '../../cache/mutations';
import {Subregion} from './Subregion/subregion';
import { set } from 'mongoose';
import {EditItem_Transaction,UpdateRegionItems_Transaction,SortRegionItems_Transaction} from '../../utils/jsTPS';
import './RegionSpreadSheet.css';
import {GrAddCircle} from 'react-icons/gr';
import {BiUndo,BiRedo} from 'react-icons/bi';


export const RegionSpreadSheet =(props)=>{
  let {map_id,region_id} = useParams();
  const [parent_id,setParentId] = useState(region_id === undefined ? map_id : region_id);
  const [isMap,setIsMap] = useState(region_id === undefined ? true : false);
  //console.log(parent_id);
  const [mapInfo,setMapInfo] = useState({});
  const [subregions,setSubregions] = useState([]);
  const [hasUndo,setHasUndo] = useState(false);
  const [hasRedo,setHasRedo] = useState(false);
  const [input,setInput] = useState({
    	_id: "",
    name: "None",
    capital: "None",
    leader:"None",
    flag: "None",
    landmarks: [],
    parent_id: parent_id,
    isParentAMap: region_id === undefined ? true : false,
    children:[]
  });
  const [previousPaths,setPreviousPaths] = useState([]);

    const {loading:previous_paths_loading, error:previous_paths_error, data:previous_paths_data,refetch:previous_paths_refetch} = useQuery(queries.GET_PREVIOUS_PATHS,{
      variables: {
        _id: parent_id
      }
    });

    useEffect(async ()=>{
      if(previous_paths_loading){
        console.log(previous_paths_loading);
      }

      if(previous_paths_error){
        console.log(`Error: ${previous_paths_error.message}`);
      }

      if(previous_paths_data){

        let {getRegionPaths} = previous_paths_data;
        if(getRegionPaths!== null){
          setPreviousPaths(getRegionPaths);
          console.log(getRegionPaths);
          console.log(previousPaths);
          props.handleSetPaths(getRegionPaths);
        }
      }
    },[previous_paths_data,previousPaths]);

  const [isInit,setIsInit] = useState(false);
  const {loading:subregion_loading,error:subregion_error,data:subregion_data,refetch:subregion_refetch} = useQuery(queries.GET_SUBREGION_BY_ID ,{
    variables:{parent_id:parent_id}
  });

  const {loading:current_map_loading, error:current_map_error,data:current_map_data,refetch:current_map_refetch} = useQuery(isMap ? queries.GET_MAP_BY_ID : queries.GET_REGION_BY_ID,{
    variables:{
      _id: parent_id
    }
  })


  const [AddSubregion] = useMutation(ADD_NEW_REGION);
  const [AddSubregionToMap] = useMutation(ADD_NEW_REGION_TO_MAP);
  const [DeleteSubregion] = useMutation(DELETE_SUBREGION);
  const [UpdateMapChildren] = useMutation(UPDATE_MAP_CHILDREN);
  const [UpdateRegionChildren] = useMutation(UPDATE_REGION_CHILDREN);


  useEffect(()=>{
    if(subregion_loading) console.log(subregion_loading);
    if(subregion_error) console.log(subregion_error);
    if(subregion_data){
      let {getRegionsByParentId} = subregion_data;
      if(getRegionsByParentId!==null){
        setSubregions(getRegionsByParentId);
      }
      setIsInit(true);
    }else{
      setIsInit(false);
    }
  },[subregion_data,subregions]);

  useEffect(() =>{
    if(current_map_loading) console.log(current_map_loading);
    if(current_map_error) console.log(current_map_error);
    if(current_map_data){
      let tobesaved = {};
      if(isMap){
        let {getMapById} = current_map_data;
        if(getMapById!==null){
          tobesaved = getMapById;
        }
      }else{
        let {getRegionById} = current_map_data;
        if(getRegionById!==null){
          tobesaved = getRegionById;
        }
      }
      setMapInfo(tobesaved);
    }
  },[current_map_data]);


  const [UpdateSubregionField] = useMutation(UPDATE_SUBREGION_FIELD);

  const tpsRedo =async () =>{
    if(props.tps.hasTransactionToRedo()){
      await props.tps.doTransaction();
      await subregion_refetch();
      await current_map_refetch();
      setHasUndo(props.tps.hasTransactionToUndo());
      setHasRedo(props.tps.hasTransactionToRedo());
    }
  }


  const tpsUndo =async () =>{
    if(props.tps.hasTransactionToUndo()){
      await props.tps.undoTransaction();
      await subregion_refetch();
      await current_map_refetch();
      setHasUndo(props.tps.hasTransactionToUndo());
      setHasRedo(props.tps.hasTransactionToRedo());
    }
  }

  const updateSubregion = async(_id, field,new_value,old_value)=>{
    let transaction = new EditItem_Transaction(_id,field,new_value,old_value,UpdateSubregionField);
    props.tps.addTransaction(transaction);
    await tpsRedo();
  }
  //pos,_id,region,opcode,addfunc,delfunc


  const AddOrDeleteSubregion = async (pos,_id,region,opcode) =>{
    console.log(region);
    console.log(isMap);
    let transaction = new UpdateRegionItems_Transaction(pos,_id,region,opcode,isMap ? AddSubregionToMap : AddSubregion,DeleteSubregion,isMap);
    props.tps.addTransaction(transaction);
    await tpsRedo();
  }

  const registerSortItemsTransaction = async (sortingCriteria) =>{
    debugger;
    let oldRegionsIds = [];
    let newRegionsToSort = [];

    for(let x = 0; x< subregions.length;x++){
      oldRegionsIds.push(subregions[x]._id);
      newRegionsToSort.push(subregions[x]);
    }

    let sortIncreasing = true;
    if(isIncreasingOrder(newRegionsToSort,sortingCriteria)){
			sortIncreasing = false;
		}

    let compareFunction = makeCompareFunction(sortingCriteria,sortIncreasing);
    newRegionsToSort = newRegionsToSort.sort(compareFunction);

    let newRegionIds = [];
    for(let x = 0; x< newRegionsToSort.length;x++){
			newRegionIds.push(newRegionsToSort[x]._id);
		}

    console.log(isMap);
    let transaction = new SortRegionItems_Transaction(parent_id,oldRegionsIds,newRegionIds,isMap ? UpdateMapChildren:UpdateRegionChildren);
    props.tps.addTransaction(transaction);
    await tpsRedo();
  }

  const isIncreasingOrder = (newItemsToSort,sortingCriteria) =>{
    for(let x = 0; x< newItemsToSort.length-1;x++){
      if(newItemsToSort[x][sortingCriteria] > newItemsToSort[x+1][sortingCriteria]){
        return false;
      }
    }
    return true;
  }

  const makeCompareFunction = (sortingCriteria,sortIncreasing) => {
		return function (item1, item2) {
      let negate = -1;
      if (sortIncreasing) {
        negate = 1;
      }
      let value1 = item1[sortingCriteria];
      let value2 = item2[sortingCriteria];
      if (value1 < value2) {
        return -1 * negate;
      }
      else if (value1 === value2) {
        return 0;
      }
      else {
        return 1 * negate;
      }
    }
	}


  return (
    <Container className = "spreadsheet_container">
      <Row className ="button_row">
          <Col sm ={1}><GrAddCircle className ="add_button" size={50}  onClick ={() =>{AddOrDeleteSubregion(subregions.length,"",{...input},1)}} /></Col>
          <Col sm ={1}><BiUndo className ={hasUndo?"undo_button" :"button_diabled"} size={50} onClick ={tpsUndo} color ={hasUndo ? "black" : "grey"} /></Col>
          <Col sm ={1}><BiRedo className ={hasRedo?"redo_button" :"button_diabled"} size={50} onClick ={tpsRedo} color ={hasRedo ? "black" : "grey"}/></Col>
          <Col sm ={9}><h3 style ={{position:"relative",left:130}}>Region Name: {mapInfo.name}</h3></Col>
      </Row>
        <Row className="table_row">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th onClick ={async () => await registerSortItemsTransaction("name")} 
              className ={subregions.length == 0? "table_header_without_regions" :"table_header_with_regions"}>Name</th>
              <th onClick = {async () => await registerSortItemsTransaction("capital")} 
              className ={subregions.length == 0? "table_header_without_regions" :"table_header_with_regions"}>Capital</th>
              <th onClick = {async () => await registerSortItemsTransaction("leader")}
              className ={subregions.length == 0? "table_header_without_regions" :"table_header_with_regions"}>Leader</th>
              <th onClick = {async () => await registerSortItemsTransaction("flag")}
              className ={subregions.length == 0? "table_header_without_regions" :"table_header_with_regions"}>Flag</th>
              <th className ={subregions.length == 0? "table_header_without_regions" :"table_header_with_regions"}>Landmarks</th>
            </tr>
          </thead>
          <tbody>
            {subregions.map((subregion,key)=>{
              return(
                <Subregion pos ={key} _id ={subregion._id} name ={subregion.name} leader ={subregion.leader} flag ={subregion.flag} landmarks ={subregion.landmarks} parent_id ={parent_id} capital = {subregion.capital} history = {props.history} updateSubregion ={updateSubregion} tps ={props.tps} AddOrDeleteSubregion ={AddOrDeleteSubregion} isParentAMap ={subregion.isParentAMap} children ={subregion.children}/>
              )
            })}
            
          </tbody>
        </Table>
        </Row>
        
    </Container>
   
  )

}