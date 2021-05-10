import {useState,useEffect} from 'react';
import {Button,Row,Col,Form,Image} from 'react-bootstrap';
import {DeleteRegion} from '../../Modals/DeleteRegion/DeleteRegion';
import './Subregion.css';





export const Subregion = (props) =>{


  const [editName,toggleEditName] = useState(false);
  const [editCapital, toggleEditCapital] = useState(false);
  const [editLeader,toggleEditLeader] = useState(false);
  const [name,setName] = useState(props.name);
  const [capital,setCapital] = useState(props.capital);
  const [leader,setLeader] = useState(props.leader);
  const [showDeleteRegion,toggleDeleteRegion] = useState(false);
  const [mapPath,setMapPath] = useState('images/The World/Africa/Algeria Flag.png');
 
  //_id, field,new_value,old_value
  useEffect(()=>{
    
    async function test(){
      console.log(`Previous Value: ${props.prevCol}`);
      console.log(`Focus Pos: ${props.focusPos}`);
      switch(props.prevCol){
        case 0:
          if(props.name !=name && name.length > 0){
            await props.updateSubregion(props._id,"name",name,props.name);
          }
          
          break;
        case 1:
          if(props.capital!= capital&& capital.length > 0){
            await props.updateSubregion(props._id,"capital",capital,props.capital);
          }
          
          break;
        case 2:
          if(props.leader!= leader && leader.length > 0){
            await props.updateSubregion(props._id,"leader",leader,props.leader);
          }
          
          break;
        default:
          break;
      }
    }

    test();

   
  },[props.prevCol,props.focusPos]);


  const getImagePath = () =>{
    let paths = props.previousPaths;
    let src = "images";
    for(let x = 0; x< paths.length;x++){
      src+=`/${paths[x].name}`;
    }
    src+=`/${props.region_name}/${props.name} Flag.png`;
    try{
      let temp = require(`../../../${src}`).default;
      return src;
    }catch(error){
      return 'images/mclovin.jpg';
    }
  }
  

  let click = false;
  let timer = 0;

  const handleClick = () =>{
    timer = setTimeout(()=>{
      if(!click){
        toggleEditName(!editName);
        props.setCurrentCol(0);
      }
      click = false;
    },200);
  }

  const handleDoubleClick = () =>{
    clearTimeout(timer);
    click = true;
    handleNavigate();
  }

  const setShowDeleteRegion = () =>{
    toggleDeleteRegion(!showDeleteRegion);
    props.setCurrentCol(-1);
  }

  const handleEditName = async (e) =>{
    let {name,value} = e.target;

    if(value !== props[name] && value.length >0){
      await props.updateSubregion(props._id,name,value,props[name]);
    }
    toggleEditName(false);
    props.setCurrentCol(-1);
  }

  const handleEditCapital = async (e) =>{
    let {name, value} = e.target;
    if(value !== props[name]&& value.length >0){
      await props.updateSubregion(props._id,name,value,props[name]);
    }
    toggleEditCapital(false);
    props.setCurrentCol(-1);
  }

  const handleEditLeader = async (e) =>{
    let {name, value} = e.target;
    if(value !== props[name]&& value.length >0){
      await props.updateSubregion(props._id,name,value,props[name]);
    }
    toggleEditLeader(false);
    props.setCurrentCol(-1);
  }


//pos,_id,region,opcode
  const handleDeleteSubregion =async () =>{
    console.log(props.isParentAMap);
    console.log(props.pos);
    let region = {
      _id: props._id,
      name: props.name,
      capital: props.capital,
      leader:props.leader,
      flag: props.flag,
      landmarks: props.landmarks,
      parent_id: props.parent_id,
      isParentAMap: props.isParentAMap,
      children:props.children,
      map:props.map
    }
    await props.AddOrDeleteSubregion(props.pos,props._id,region,0);
    toggleDeleteRegion(false);
    props.setCurrentCol(-1);
  }

  const manipulateUrl = () =>{
    let current_path = props.history.location.pathname+"";
    //props.history.push(`${current_path}/${props._id}`);
    let path = current_path.split("/");
    if(path.length == 4){
      path[path.length-1] = props._id;
    }else{
      path.push(props._id);
    }
    
    console.log(path);
    let new_path ="/";
    for(let x = 1; x< path.length;x++){
      if(x == path.length-1){
        new_path+=path[x];
      }else{
        new_path+=(path[x]+"/");
      }
    }
    return new_path;
  }
  const handleNavigate = () =>{
    props.tps.clearAllTransactions();
    let path = manipulateUrl();
    window.location = path;
  }

  const handleClickLandmarks =() =>{
    window.location = `/your_maps/${props._id}/region/viewer`;
  }

  return (
    <>
    <tr id = {props._id} className ={props.pos == props.focusPos ? "selected_region":"unselected_region" }>
      <td>
        <Row>
          <Col><Button variant ="danger" onClick ={setShowDeleteRegion}>Delete</Button></Col>
          <Col><Button variant = "secondary" onClick ={handleNavigate}>Navigate To Me</Button></Col>
        </Row>
        
        
      </td>
      {
        (props.pos == props.focusPos ? (props.currentCol !=0 && !editName) : !editName) ? <td onClick ={handleClick} onDoubleClick = {handleDoubleClick} >{props.name}</td> : (
          <td>
            <Form>
            <Form.Control type="text" value = {name} placeholder="Enter your new name" onBlur ={handleEditName} autoFocus={true} name = "name" onChange ={(e) => setName(e.target.value)}/>
          </Form>
          </td>
          
        )
      }

      {
        (props.pos == props.focusPos ?  (props.currentCol !=1 && !editCapital) : !editCapital) ? <td onClick = {() =>{
          toggleEditCapital(!editCapital);
          props.setCurrentCol(1);
          }}>
            
            {props.capital}</td> : (
          <td>
            <Form>
              <Form.Control type="text" value ={capital} placeholder="Enter your new capital" onBlur ={handleEditCapital}  autoFocus={true} name = "capital" onChange ={(e) => setCapital(e.target.value)}/>
            </Form>
          </td>
        )
      }


      {
        (props.pos == props.focusPos ?  (props.currentCol !=2 && !editLeader) : !editLeader) ? <td onClick = {() =>{
          toggleEditLeader(!editLeader)
          props.setCurrentCol(2);
        
        }}>{props.leader}</td> : (
          <td>
            <Form>
            <Form.Control type="text" value ={leader} placeholder="Enter your new leader" onBlur ={handleEditLeader} autoFocus={true} name = "leader" onChange ={(e) => setLeader(e.target.value)}/>
          </Form>
          </td>
          
        )
      }

      <td>
        <img  className="flag_img" src={require(`../../../${getImagePath()}`).default}/>
      </td>

      <td onClick ={handleClickLandmarks} className ="landmark_td">{props.landmarks[0]+","+props.landmarks[1]+" ....."}</td>
  </tr>
  {showDeleteRegion && <DeleteRegion setShowDeleteRegion ={setShowDeleteRegion} showDeleteRegion ={showDeleteRegion} handleDeleteSubregion ={handleDeleteSubregion} />}
  </>
  )
}