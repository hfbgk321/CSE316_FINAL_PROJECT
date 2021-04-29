import react,{useState} from 'react';
import {Modal,Button,Form} from 'react-bootstrap';
import {useMutation} from '@apollo/client';
import {UPDATE} from '../../../cache/mutations';


export const UpdateAccount = (props) =>{

  const [input, setInput] = useState({ email: props.user.email === null ? "": props.user.email,current_password:"", new_password: '', name:props.user.name === null ? "" : props.user.name});
  const [name,setName] = useState(props.user === null ? "": props.user.name);
  const [email,setEmail] = useState(props.user === null ? "": props.user.email);
	const [loading, toggleLoading] = useState(false);
  const [showErr, displayErrorMsg] = useState(false);
	const [error,setError] = useState("");
  const [Update] = useMutation(UPDATE);

  const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
		console.log(input);
	};

  const handleCreateAccount = async (e) => {
		for (let field in input) {
			if (!input[field]) {
        setError('All fields must be filled out to update');
        displayErrorMsg(true);
				return;
			}
		}
    debugger;

		const { loading, error, data } = await Update({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { 
			console.log(error.message);
			return `Error: ${error.message}` 
		};
		if (data) {
			console.log(data)
			toggleLoading(false);
			if(data.update.email === 'already exists') {
        setError('User with that email already registered');
        displayErrorMsg(true);
        return;
			}else if(data.update.email ==="invalid password"){
        setError('Invalid Password. Please enter your current password');
        displayErrorMsg(true);
        return;
      }else if(data.update.email ==="unable to change"){
        setError('unable to change');
        displayErrorMsg(true);
        return;
      }
			else {
				await props.fetchUser();
        props.history.push("/your_maps");
			}
			props.setShowUpdate(false);

		};
	};

  

  if(!props.isInit){
    return "";
  }
  return (
    <Modal centered show={props.showUpdate} onHide={() =>props.setShowUpdate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            loading ? <div />
            : <Form>
              <Form.Group controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder={props.user === null ? "": props.user.name } 
                value = {name} onChange = {(e) => setName(e.target.value)} name ="name" onBlur ={updateInput}/>
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder={props.user === null ? "" : props.user.email} 
                value ={email} onChange ={(e) => setEmail(e.target.value)} name ="email" onBlur ={updateInput}/>
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicCurrentPassword">
                <Form.Label>Current Password</Form.Label>
                <Form.Control type="password" placeholder="*******s" name ="current_password" onBlur ={updateInput}/>
              </Form.Group>

              <Form.Group controlId="formBasicNewPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control type="password" placeholder="Enter a new password" name ="new_password" onBlur ={updateInput}/>
              </Form.Group>
              {
                showErr ? <Form.Group controlId="errormessage">
                            <Form.Text className="text-muted">
                              {error}
                            </Form.Text>
                          </Form.Group>
                          :<div />

              }
            </Form>
        }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() =>props.setShowUpdate(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateAccount}>
            Sign Up
          </Button>
        </Modal.Footer>
      </Modal>
  )
}