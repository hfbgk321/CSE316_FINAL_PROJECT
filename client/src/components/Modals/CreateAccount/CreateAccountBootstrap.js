import react, {useState} from 'react';
import {Modal,Button,Form} from 'react-bootstrap';
import {REGISTER} from '../../../cache/mutations';
import {useMutation} from '@apollo/client';

export const CreateAccountBootstrap = (props) =>{
  const [input, setInput] = useState({ email: '', password: '', name:"" });
	const [loading, toggleLoading] = useState(false);
	const [Register] = useMutation(REGISTER);
  const [showErr, displayErrorMsg] = useState(false);
	const [error,setError] = useState("");


  const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
		console.log(input);
	};

  const handleCreateAccount = async (e) => {
		for (let field in input) {
			if (!input[field]) {
        setError('All fields must be filled out to register');
        displayErrorMsg(true);
				return;
			}
		}
		const { loading, error, data } = await Register({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (error) { 
			console.log(error.message);
			return `Error: ${error.message}` 
		};
		if (data) {
			console.log(data)
			toggleLoading(false);
			if(data.register.email === 'already exists') {
        setError('User with that email already registered');
        displayErrorMsg(true);
        return;
			}
			else {
				await props.fetchUser();
        window.location ="/your_maps";
			}
			props.setShowCreate(false);

		};
	};

  return (
    <Modal centered show={props.showCreate} onHide={() =>props.setShowCreate(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            loading ? <div />
            : <Form>
              <Form.Group controlId="formBasicName">
                <Form.Label>Name</Form.Label>
                <Form.Control type="text" placeholder="Enter your name" name ="name" onBlur ={updateInput}/>
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" name ="email" onBlur ={updateInput}/>
                <Form.Text className="text-muted">
                  We'll never share your email with anyone else.
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" name ="password" onBlur ={updateInput}/>
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
          <Button variant="secondary" onClick={() =>props.setShowLogin(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateAccount}>
            Sign Up
          </Button>
        </Modal.Footer>
      </Modal>
  )



}