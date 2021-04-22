import react,{useState} from 'react';
import {Modal,Button,Form} from 'react-bootstrap';
import {LOGIN} from '../../../cache/mutations';
import { useMutation, useApolloClient }     from '@apollo/client';

export const LoginBootStrap = (props) =>{

  const [input, setInput] = useState({ email: '', password: '' });
	const [loading, toggleLoading] = useState(false);
	const [showErr, displayErrorMsg] = useState(false);
	const errorMsg = "Email/Password not found.";
	const [Login] = useMutation(LOGIN);

  const updateInput = (e) => {
		const { name, value } = e.target;
		const updated = { ...input, [name]: value };
		setInput(updated);
    console.log(input);
	}

  const handleLogin = async (e) => {

		const { loading, error, data } = await Login({ variables: { ...input } });
		if (loading) { toggleLoading(true) };
		if (data.login._id === null) {
			displayErrorMsg(true);
			return;
		}
		if (data) {
			await props.fetchUser();
			// props.refetchTodos();
			toggleLoading(false)
			props.setShowLogin(false);
			window.location ="/your_maps";
		};
	};

  return (
    <Modal centered show={props.showLogin} onHide={() =>props.setShowLogin(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            loading ? <div />
            : <Form>
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
                              {errorMsg}
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
          <Button variant="primary" onClick={handleLogin}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
  )
}