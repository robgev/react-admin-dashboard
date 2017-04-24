'use strict';

const path = require('path');
const express = require('express');
const admin_router = express.Router();
const body_parser = require('body-parser');
const admin = require('firebase-admin')
const json_parser = body_parser.json();
const form_parser = body_parser.urlencoded({extended: true});

const serviceAccount = require("./serviceAccountKey.json");

admin_router.use(json_parser, form_parser);

admin_router.post('/activestatus', async (req, res) => {
  const {uid} = req.body
  try {
    const userData = await admin.auth().getUser(uid)
    res.end(JSON.stringify({status: 'ok', disabled: userData.disabled}))
  } catch(error) {
    console.log("Error fetching user data:", error);
    res.end(JSON.stringify({status: 'error', message: 'something went wrong'}))
  }
})

admin_router.post('/deactivate', async (req, res) => {
  const {uid} = req.body
  try {
    const userData = await admin.auth().getUser(uid)
    const updatedData = await admin.auth().updateUser(uid, {
     disabled: !userData.disabled
    })
    const dbRef = firebase.database().ref(`users/${uid}`);
    dbRef.update({
      active: updatedData.disabled
    })
    res.end(JSON.stringify({status: 'ok', disabled: updatedData.disabled}))
  } catch(error) {
    console.log('Error fetching user data:', error);
    res.end(JSON.stringify({status: 'error', message: 'something went wrong'}))
  }
})

admin_router.post('/edit', async (req, res) => {
  const {uid, email, password, displayName} = req.body;
  const updatedData = {}
  if (email) { updatedData.email = email } // Checks if email is in body to change
  if (password) { updatedData.password = password }
  if (displayName) { updatedData.displayName = displayName }
  try {
    const userData = await admin.auth().updateUser(uid, updatedData)
    const dbRef = firebase.database().ref(`users/${uid}`);
    dbRef.update({
      updatedData
    })
    res.end(JSON.stringify({status: 'ok', userData}))
  } catch(error) {
    console.log('Something went wrong:', error);
    res.end(JSON.stringify({status: 'error', message: 'something went wrong'}));
  }
})

admin_router.post('/add', async (req, res) => {
  const {email, password} = req.body;
  const name = email.split("@")[0];
  const newUserData = {
    email,
    emailVerified: false,
    password,
    displayName: name,
    photoURL: "/images/profile.svg",
    disabled: false
  }
  try {
    const userData = await admin.auth().createUser(newUserData)
    const dbRef = firebase.database().ref(`users/${userData.uid}`);
    dbRef.set({
      email,
      password,
      username: name,
      created: moment().format("MMM D, YYYY"),
      isAdmin : false,
    });
    res.end(JSON.stringify({status: 'ok', userData}))
  } catch(error) {
    console.log('Something went wrong:', error);
    res.end(JSON.stringify({status: 'error', message: 'something went wrong'}));
  }
})

admin_router.post('/delete', async (req, res) => {
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
  databaseURL: "https://apollobytes-internal.firebaseio.com"
});

module.exports = admin_router;
