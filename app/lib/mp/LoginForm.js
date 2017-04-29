import React from 'react';

import {loginAction} from '../../actions/login.action.js';
import {connect} from 'react-redux';

import {firebase} from '../firebaseAPI.js';

import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';

import colors from '../colors';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mail: '',
      pass: ''
    };
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const {mail, pass} = this.state;
    firebase.auth().signInWithEmailAndPassword(mail, pass).catch(error => {
      console.log(error);
      return false;
    }).then((bool = true) => {
      if (bool)
        this.props.loginAction();
    })
  };

  handleChange = (key, value) => {
    this.setState({[key]: value})
  };

  render() {
    const main = {
      width: '90%',
      height: 45,
      padding: '20px 0px',
      margin: '0 0 10px 0',
      fontSize: 18,
    };

    const floatinglabelstyle = {
      color: '#fff',
    };

    const inpstyle = {
      padding: '7px 5px',
      margin: '20px 0',
      display: 'block',
      border: 'none',
      backgroundColor: colors.backgroundColor,
      fontSize: 18,
      borderRadius: 5,
      boxShadow: '3px 5px 3px colors.blueDark',
    };

    return (
      <div className='loginPage'>
        <div className='form'>
          <div className='logintitle'>
            <h1>Login</h1>
          </div>
          <form className='formcontent' onSubmit={this.handleSubmit}>
            <div>
              <label className='loginlabel'>Email</label>
              <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <TextField
                  hintText='Email field'
                  style={main}
                  floatingLabelStyle={floatinglabelstyle}
                  inputStyle ={inpstyle}
                  floatingLabelText='Email'
                  type='email'
                  onChange={(e) => this.handleChange('mail', e.target.value)}
                />
              </MuiThemeProvider>
            </div>
            <div>
              <label className='loginlabel'>Password</label>
              <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
                <TextField
                  hintText='Email field'
                  style={main}
                  floatingLabelStyle={floatinglabelstyle}
                  inputStyle ={inpstyle}
                  floatingLabelText='Password'
                  type='password'
                  ref={(pass) => {
                    this.pass = pass
                  }}
                  onChange={(e) => this.handleChange('pass', e.target.value)}
                />
              </MuiThemeProvider>
            </div>
            <div>
              <button type='submit' className='loginbutton'>Submit</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

export default connect(null, {loginAction})(LoginForm);
