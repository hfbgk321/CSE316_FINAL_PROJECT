import react,{useState} from 'react';
import {Modal,Button,Form} from 'react-bootstrap';
import {CREATE_MAP} from '../../../cache/mutations';
import {useMutation,useQuery} from '@apollo/client';
import * as queries from '../../../cache/queries';
/*_id: String
	children: [Int]
	name: String
	ownerId : String
  */


export const CreateMap = (props) =>{

  const [name, setName] = useState("");
	const [loading, toggleLoading] = useState(false);
	const [showErr, displayErrorMsg] = useState(false);
  const [errorMsg,setError] = useState("");
	const [AddNewMap] = useMutation(CREATE_MAP);
  

  const updateName = (e) => {
		setName(e.target.value);
    console.log(name);
	}

  const handleCreateNewMap = async (e) => {
    if(name.length == 0){
      setError('Please enter a name for the map');
      displayErrorMsg(true);
      return;
    }

    let map = {
      _id:"",
      children:[],
      name:name,
      ownerId:"",
      access_id:0
    };

		const { loading, error, data } = await AddNewMap({ variables: {map:map} });
    
		if (loading) { toggleLoading(true) };
    if (error) { 
			console.log(error.message);
			return `Error: ${error.message}` 
		};

		if (data) {
      let {addNewMap} = data;
      if(addNewMap!==null){
        window.location = `/your_maps/${addNewMap._id}`;
        await props.fetchMaps();
        toggleLoading(false)
        props.setShowCreateMap(false);
        
      }
			
		};
	};


  return (
    <Modal centered show={props.showCreateMap} onHide={() =>props.setShowCreateMap(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Map</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            loading ? <div />
            : <Form>
              <Form.Group controlId="formBasicEmail">
                <Form.Label>Name</Form.Label>
                <Form.Control type="email" placeholder="Enter the map name" name ="name" onBlur ={updateName}/>
              </Form.Group>

              {
                showErr ? <Form.Group controlId="errormessage">
                            <Form.Text className="text-muted">
                              {errorMsg}
                            </Form.Text>
                          </Form.Group>
                          :<div />

              }
            </Form>
        }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() =>props.setShowCreateMap(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateNewMap}>
            Create Map
          </Button>
        </Modal.Footer>
      </Modal>
  )
}