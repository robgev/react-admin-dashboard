import {map, get} from 'lodash';
import React, { Component } from 'react';
import {Table, TableBody, TableFooter, TableHeader, TableHeaderColumn, TableRow, TableRowColumn}
  from 'material-ui/Table';

import LoadingScreen from './components/LoadingScreen';
import DialogAction from './components/DialogAction';
import { generate_request } from '../utils';
import Header from './components/Header';
import Footer from './components/Footer';

export default
class AdminPanel extends Component {
  constructor() {
    super();
    this.state = {
      sorting: {
        by: 'Name',
        up: false
      },
      dbData: null,
      bannerText: '',
      selectedUser: '',
      showBanner: false,
      activeState: true,
      showAddModal: false,
      showEditModal: false,
      showDeleteModal: false,
    }
  }

  componentDidMount() {
    const { dbRef } = this.props;
    const dbRequest = dbRef.once('value')
    dbRequest.then(snapshot => {
      const dbData = snapshot.val();
      this.setState({...this.state, dbData})
    })
  }

  showBanner = (bannerText) => {
    this.setState({...this.state, showBanner: true, bannerText})
    setTimeout(() => {
      this.setState({...this.state, showBanner: false, bannerText: ''})
    }, 3000)
  }

  deleteAccount = async () => {
    const { selectedUser } = this.state;
    this.toggleDeleteModal();
    const send_to_server = generate_request({uid: selectedUser});
    const answer = await fetch(`/manageusers/delete`, send_to_server);
    const answer_json = await answer.json();
    this.showBanner(`User was deleted`);
  }

  updatePhoto = () => { // Should think about a way of implementing
    const { updatePhoto } = this.props;
  }

  updateUserData = async (email, password, name) => {
    const { selectedUser } = this.state;
    let shouldShowBanner = false;
    const updatedData = {}
    if(email.trim()) {
      updatedData.email = email;
      shouldShowBanner = true;
    }
    if(password.trim()) {
      updatedData.password = password;
      shouldShowBanner = true;
    }
    if(name.trim()) {
      updatedData.name = name;
      shouldShowBanner = true;
    }
    const send_to_server = generate_request({...updatedData, uid: selectedUser});
    const answer = await fetch(`/manageusers/edit`, send_to_server);
    const answer_json = await answer.json();
    if(shouldShowBanner) {
      this.showBanner(`User info was updated`);
    }
  }

  toggleUserActiveState = async () => {
    const { selectedUser, activeState } = this.state;
    const send_to_server = generate_request({uid: selectedUser});
    const answer = await fetch(`/manageusers/deactivate`, send_to_server);
    const answer_json = await answer.json();
    const bannerText = activeState ? 'disabled' : 'enabled';
    this.showBanner(`User was ${bannerText}`);
    this.setState({ ...this.state, activeState: !activeState  })
  }

  handleSelected = (uid, e) => {
    const {dbData} = this.state;
    const answer = get(dbData, `${uid}.active`);
    console.log(answer);
    this.setState({ ...this.state, selectedUser: uid, activeState: answer})
  }

  addNewUser = async (email, password) => {
    const send_to_server = generate_request({email, password});
    const answer = await fetch(`/manageusers/add`, send_to_server);
    const answer_json = await answer.json();
    this.showBanner(`User was added`);
  }

  constructTable = () => {
    const {dbData} = this.state;
    const renderElms = map(dbData, (currentUserData, uid) => {
      const isSelected = this.state.selectedUser === uid ? 'selected' : '';
      return (
        <tr
          key={uid}
          onClick={this.handleSelected.bind(this, uid)}
          className={isSelected}>
          <td className={'row-cell'}>
            <div>
              {currentUserData.username}
            </div>
          </td>
          <td className={'row-cell'}>
            <div>
              {currentUserData.created}
            </div>
          </td>
          <td className={'row-cell'}>
            <div>
              {currentUserData.email}
            </div>
          </td>
          <td className={'row-cell'}>
            <div>
              {currentUserData.password}
            </div>
          </td>
          <td className={'row-cell'}>
            <div>
              {currentUserData.isAdmin ? 'true' : 'false'}
            </div>
          </td>
        </tr>
      );
    })
    return (
      <tbody>
        {renderElms}
      </tbody>
    );
  }

  render() {
    const {
      showBanner,
      bannerText,
      activeState,
      showAddModal,
      selectedUser,
      showEditModal,
      showDeleteModal,
    } = this.state;
    const { user } = this.props
    const { displayName, email, emailVerified, photoURL, uid, providerData } = user;
    const deactivateButtonText = activeState ? 'Deactivate' : 'Activate';
    return (
      <div className='adminContainer full-width'>
        <Header
          id={2}
          user={user}
          admin={true}
          signOut={this.props.signOut}
        />
      <div className='admin-body'>
        <div className='buttons'>
            {
              showBanner &&
              <div className='success'>{bannerText}</div>
            }
            <DialogAction
              email
              password
              buttonText='Add'
              modalAction={this.addNewUser}
              modalButtonText='Add New User'
              headerText='Enter Credentials'
              buttonStyle={{...(!selectedUser ? {disabled: true} : {primary: true})}}
              noticeText='Enter email and password for a new user'
            />
            <DialogAction
              email
              password
              displayName
              buttonText='Edit'
              modalButtonText='Edit'
              headerText='Enter Credentials'
              modalAction={this.updateUserData}
              noticeText='Enter the credentials you want to change'
              buttonStyle={{...(!selectedUser ? {disabled: true} : {primary: true})}}
            />
            <DialogAction
              warningButton
              buttonText='Delete'
              modalButtonText='Delete'
              modalAction={this.deleteAccount}
              noticeText='Warning: this action cannot be undone'
              headerText='Are you sure you want to delete this user?'
              buttonStyle={{...(!selectedUser ? {disabled: true} : {secondary: true})}}
            />
            <DialogAction
              warningButton
              modalAction={this.toggleUserActiveState}
              buttonText={deactivateButtonText}
              noticeText={`Notice: You can ${activeState ? 'activate' : 'deactivate'} the user later`}
              modalButtonText={deactivateButtonText}
              headerText={`Are you sure you want to ${deactivateButtonText.toLowerCase()} this user?`}
              buttonStyle={{...(!selectedUser ? {disabled: true} : null)}}
            />
          </div>
          <div className='table-body'>
            <div className='toolbar'>
              <i className='material-icons'>search</i>
              <input
                type='text'
                className='search'
                placeholder=' Search by email address or user UID '
              />
            </div>
            <div className='table-container'>
              <table>
                <thead>
                  <tr>
                    <th>
                      <div>
                        Name
                        <i className='material-icons'>arrow_downward</i>
                      </div>
                    </th>
                    <th>
                      <div>
                        Created
                        <i className='material-icons'>arrow_downward</i>
                      </div>
                    </th>
                    <th>
                      <div>
                        Email
                        <i className='material-icons'>arrow_downward</i>
                      </div>
                    </th>
                    <th>
                      <div>
                        Password
                        <i className='material-icons'>arrow_downward</i>
                      </div>
                    </th>
                    <th>
                      <div>
                        Is Admin
                        <i className='material-icons'>arrow_downward</i>
                      </div>
                    </th>
                  </tr>
                </thead>
                {this.constructTable()}
              </table>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
};
