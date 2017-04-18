import React from 'react';

class LoginSignup extends React.PureComponent {
  logIn = () => {
    firebase.auth().signInWithEmailAndPassword(this.email.value, this.password.value).catch(error => {
      console.log(error);
    });
  }
  render() {
    return(
      <div className="logsing-body">
        <div className="container">
          <div className="login-signup">
            <input ref={email => this.email = email} placeholder="Email"></input>
            <input ref={password => this.password = password} type="password" placeholder="Password"></input>
            <button onClick={this.logIn}>Log In</button>
            <button> Sign Up </button>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginSignup;
