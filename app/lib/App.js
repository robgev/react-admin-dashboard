//Import used libs
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
} from 'react-router-dom';

// Import our compnents
import User from './ur/User';
import auth from './firebaseAPI';
import SigninBox from './ur/SignIn';
import AdminPanel from './ur/Admin';
import MainPage from './mp/MainPage';
import ResourceManager from './hr/App';
import NotFound from './ur/components/NotFound';
import LoadingScreen  from './ur/components/LoadingScreen';

//This App component is wrapped by MuiThemeProvider at the end.
// This is done to allow server side rendering.
// Check react-router-dom -> StaticRouter for more.
export default
class App extends Component {
  constructor() {
    super();
    this.state = {
      currentUser: {}, // to avoid first un-signed in render when some1 is signed in
      promise: new Promise(resolve=>{}),
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged(currentUser => {
      if (currentUser) {
        const { displayName, email, emailVerified, photoURL, uid, providerData } = currentUser;
        if (displayName === null) {
          const newName = email.split('@')[0];
          currentUser.updateProfile({
            displayName: newName,
          })
          .then(() => this.setState({...this.state, currentUser}))
          .catch(error => console.log)

        }
        if (photoURL === null || photoURL === '/profile.svg') {
          currentUser.updateProfile({
            photoURL: '/images/profile.svg',
          })
          .then(() => this.setState({...this.state, currentUser}))
          .catch(error => console.log)
        }
        const dbRef = firebase.database().ref(`users/${uid}`)
        const promise = dbRef.once('value')
        this.setState({...this.state, promise, currentUser})
      }
      else {
        const currentUser = null;
        this.setState({...this.state, currentUser})
      }
    });
  }

  render() {
    const { currentUser, isAdmin, promise } = this.state;
    return (
      <div className='container'>
          <div className='router-wrapper'>
            <Switch>
              <Route
                exact path='/'
                render={() => {
                  if(currentUser) {
                    return(
                      <LoadingScreen
                        promise={ promise }
                        whenPending= { () => {
                          return (
                            <div className='loading-screen'>
                              <img src='/images/loading.gif' />
                            </div>
                          );
                        }}
                        whenResolved={ snapshot => {
                          const value = snapshot.val();
                          const isAdmin = value ? value.isAdmin : false;
                          if(isAdmin) {
                            return (
                              <Redirect to='/admin' />
                            );
                          }
                          else {
                            return (
                              <Redirect to='/management'/>
                            );
                          }
                        }}
                      />
                    );
                  }
                  else {
                    return (
                      <Redirect to='/signin'/>
                    );
                  }
                }}
              />
              <Route
                path='/signin'
                render={ props =>
                  !currentUser ?
                  <SigninBox
                    submit={auth.handleSignIn}
                    signUp={auth.handleSignUp}
                    passwordReset={auth.sendPasswordReset}
                    {...props}
                  /> :
                  <Redirect to='/user'/>
                 }
              />
              <Route
                path='/room'
                render={ props => {
                  if(currentUser) {
                    return(
                      <LoadingScreen
                        promise={ promise }
                        whenPending= { () => {
                          return (
                            <div className='loading-screen'>
                              <img src='/images/loading.gif' />
                            </div>
                          );
                        }}
                        whenResolved={ snapshot => {
                          const value = snapshot.val();
                          const isAdmin = value ? value.isAdmin : false;
                          return (
                            <MainPage
                              user = {currentUser}
                              admin = {isAdmin}
                              signOut={auth.handleSignOut}
                            />
                          );
                        }}
                      />
                    );
                  }
                  else {
                    return (
                      <Redirect to='/signin'/>
                    );
                  }
                }}
              />
              <Route
                path='/management'
                render={ props => {
                  if(currentUser) {
                    return(
                      <LoadingScreen
                        promise={ promise }
                        whenPending= { () => {
                          return (
                            <div className='loading-screen'>
                              <img src='/images/loading.gif' />
                            </div>
                          );
                        }}
                        whenResolved={ snapshot => {
                          const value = snapshot.val();
                          const isAdmin = value ? value.isAdmin : false;
                          return (
                            <ResourceManager
                              match = {props}
                              user = {currentUser}
                              admin = {isAdmin}
                              signOut={auth.handleSignOut}
                            />
                          );
                        }}
                      />
                    );
                  }
                  else {
                    return (
                      <Redirect to='/signin'/>
                    );
                  }
                }}
              />
              <Route
                path='/user'
                render={ props => {
                  if(currentUser) {
                    return(
                      <LoadingScreen
                        promise={ promise }
                        whenPending= { () => {
                          return (
                            <div className='loading-screen'>
                              <img src='/images/loading.gif' />
                            </div>
                          );
                        }}
                        whenResolved={ snapshot => {
                          const value = snapshot.val();
                          const isAdmin = value ? value.isAdmin : false;
                          return (
                            <User
                              user = {currentUser}
                              signOut={auth.handleSignOut}
                              changePass={auth.changePass}
                              deleteUser={auth.deleteUser}
                              updateName={auth.updateName}
                              updateEmail={auth.updateEmail}
                              updatePhoto={auth.updatePhoto}
                              admin={isAdmin}
                              {...props}
                            />
                          );
                        }}
                      />
                    );
                  }
                  else {
                    return (
                      <Redirect to='/signin'/>
                    );
                  }
                }}
              />
              <Route
                path='/admin'
                render={ props => {
                    if(currentUser) {
                      return(
                        <LoadingScreen
                          promise={ promise }
                          whenPending= { () => {
                            return (
                              <div className='loading-screen'>
                                <img src='/images/loading.gif' />
                              </div>
                            );
                          }}
                          whenResolved={ snapshot => {
                            const value = snapshot.val();
                            const isAdmin = value ? value.isAdmin : false;
                            if(isAdmin) {
                              return (
                                <AdminPanel
                                  user = {currentUser}
                                  dbRef = {firebase.database().ref('users')}
                                  signOut={auth.handleSignOut}
                                  changePass={auth.changePass}
                                  deleteUser={auth.deleteUser}
                                  updateName={auth.updateName}
                                  updateEmail={auth.updateEmail}
                                  updatePhoto={auth.updatePhoto}
                                  admin={isAdmin}
                                  {...props}
                                />
                              );
                            }
                            else {
                              return (
                                <Route component={NotFound} />
                              );
                            }
                          }}
                        />
                      );
                    }
                    else {
                      return (
                        <Redirect to='/signin'/>
                      );
                    }
                  }
                }
              />
              <Route component={NotFound} />
            </Switch>
          </div>
      </div>
    );
  }
};
