import {map} from 'lodash';
import React, { Component } from 'react';

import DialogAction from './components/DialogAction';
import LoadingScreen from './components/LoadingScreen';
import { generate_request } from '../utils';
import Header from './components/Header';
import Footer from './components/Footer';

export default
class AdminPanel extends Component {
  constructor() {
    super();
    this.state = {
      showBanner: false,
      selectedUser: '',
      bannerText: '',
      activeState: true,
      showDeleteModal: false,
      showAddModal: false,
      showEditModal: false,
    }
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

  updateUserData = async () => {
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

  handleSelected = async (uid, e) => {
    const send_to_server = generate_request({uid});
    const data = await fetch(`/manageusers/activestatus`, send_to_server);
    const answer = await data.json();
    this.setState({ ...this.state, selectedUser: uid, activeState: !answer.disabled})
  }

  addNewUser = async () => {
    const send_to_server = generate_request({email, password});
    const answer = await fetch(`/manageusers/add`, send_to_server);
    const answer_json = await answer.json();
    this.showBanner(`User was added`);
  }

  constructTable = (snapshot) => {
    const value = snapshot.val();
    const renderElms = map(value, (currentUserData, uid) => {
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
      showEditModal,
      showDeleteModal
    } = this.state;
    const { user, dbRef } = this.props;
    const promise = dbRef.once('value');
    const { displayName, email, emailVerified, photoURL, uid, providerData } = user;
    return (
      <div className='adminContainer full-width'>
        <Header
          id={3}
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
              noticeText='Enter email and password for a new user'
            />
            <DialogAction
              email
              password
              displayName
              buttonText='Edit'
              modalAction={this.updateUserData}
              modalButtonText='Edit'
              headerText='Enter Credentials'
              noticeText='Enter the credentials you want to change'
            />
            <DialogAction
              warningButton
              buttonText='Delete'
              modalAction={this.deleteAccount}
              modalButtonText='Delete'
              headerText='Are you sure you want to delete this user?'
              noticeText='Warning: this action cannot be undone'
            />
            <DialogAction
              warningButton
              buttonText='Deactivate'
              modalAction={this.toggleUserActiveState}
              modalButtonText={activeState ? 'Deactivate' : 'Activate'}
              headerText='Are you sure you want to delete this user?'
              noticeText='Warning: this action cannot be undone'
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
                <LoadingScreen
                  promise={ promise }
                  whenPending= { () => {
                    return (
                      <tbody>
                        <tr>
                          <td colSpan='5'>
                            <div className='loading-screen users'>
                              <img src='/images/loadingSmall.gif' />
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    )
                  }}
                  whenResolved={ snapshot => {
                    return this.constructTable(snapshot)
                  }}
                />
              </table>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
};
