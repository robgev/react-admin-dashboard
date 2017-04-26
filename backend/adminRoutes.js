'use strict';

const path = require('path');
const express = require('express');
const adminRouter = express.Router();
const body_parser = require('body-parser');
const admin = require('firebase-admin');
const json_parser = body_parser.json();
const form_parser = body_parser.urlencoded({extended: true});
const firebaseAPI  = require('../frontend/lib/firebaseAPI').default

const serviceAccount = require('./serviceAccountKey.json');

adminRouter.use(json_parser, form_parser);

adminRouter.post('/activestatus', async (req, res) => {
  const {uid} = req.body
  try {
    const userData = await admin.auth().getUser(uid)
    res.end(JSON.stringify({status: 'ok', disabled: userData.disabled}))
  } catch(error) {
    console.log('Error fetching user data:', error);
    res.end(JSON.stringify({status: 'error', message: 'something went wrong'}))
  }
})

adminRouter.post('/deactivate', async (req, res) => {
  const {uid} = req.body
  try {
    const userData = await admin.auth().getUser(uid)
    const updatedData = await admin.auth().updateUser(uid, {
     disabled: !userData.disabled
    })
    firebaseAPI.deactivate(uid, updatedData.disabled)
    res.end(JSON.stringify({status: 'ok', disabled: updatedData.disabled}))
  } catch(error) {
    console.log('Error fetching user data:', error);
    res.end(JSON.stringify({status: 'error', message: 'something went wrong'}))
  }
})

adminRouter.post('/edit', async (req, res) => {
  const {uid, email, password, displayName} = req.body;
  const updatedData = {}
  if (email) { updatedData.email = email } // Checks if email is in body to change
  if (password) { updatedData.password = password }
  if (displayName) { updatedData.displayName = displayName }
  try {
    const userData = await admin.auth().updateUser(uid, updatedData)
    firebaseAPI.editUserInfo(uid, updatedData)
    res.end(JSON.stringify({status: 'ok', userData}))
  } catch(error) {
    console.log('Something went wrong:', error);
    res.end(JSON.stringify({status: 'error', message: 'something went wrong'}));
  }
})

adminRouter.post('/add', async (req, res) => {
  const {email, password} = req.body;
  const name = email.split('@')[0];
  const newUserData = {
    email,
    emailVerified: false,
    password,
    displayName: name,
    photoURL: '/images/profile.svg',
    disabled: false
  }
  try {
    const userData = await admin.auth().createUser(newUserData)
    const newUserObject = {
      email,
      password,
      username: name,
      created: moment().format('MMM D, YYYY'),
      isAdmin : false,
    }
    firebaseAPI.addNewUser(userData.uid, newUserObject)
    res.end(JSON.stringify({status: 'ok', userData}))
  } catch(error) {
    console.log('Something went wrong:', error);
    res.end(JSON.stringify({status: 'error', message: 'something went wrong'}));
  }
})

adminRouter.post('/delete', async (req, res) => {
  const {uid} = req.body;
  try {
    await admin.auth().deleteUser(uid)
    const dbRef = firebase.database().ref(`users/${uid}`);
    dbRef.remove();
    res.end(JSON.stringify({status: 'ok', message: 'successfully deleted user'}))
  } catch(error) {
    console.log('Something went wrong:', error);
    res.end(JSON.stringify({status: 'error', message: 'something went wrong'}));
  }
})

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://apollobytes-internal.firebaseio.com'
});

module.exports = adminRouter;
