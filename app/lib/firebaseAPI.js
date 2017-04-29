import firebase from 'firebase';
import moment from 'moment';

export { firebase };

const firebaseConf = {
  apiKey: 'AIzaSyAyTbFTm6al2lHZ0xctrC_HEaG_oL63X_Q',
  authDomain: 'apollobytes-internal.firebaseapp.com',
  databaseURL: 'https://apollobytes-internal.firebaseio.com',
  storageBucket: 'apollobytes-internal.appspot.com',
  messagingSenderId: '514298207210'
};
firebase.initializeApp(firebaseConf);

//Conf end

let userPassword = '';

// Simple functions

const handleSignOut = () => {
  if (firebase.auth().currentUser) {
    firebase.auth().signOut();
  }
}

const handleSignIn = (email, password) => {
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }

  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }

  firebase.auth().signInWithEmailAndPassword(email, password)
  .then(result => {
    userPassword = password;
  })
  .catch(error => {
    const errorCode = error.code;
    const errorMessage = error.message;
    if (errorCode === 'auth/wrong-password') {
      alert('Wrong password.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
  });
}

const handleSignUp = (email, password) => {
  if (email.length < 4) {
    alert('Please enter an email address.');
    return;
  }

  if (password.length < 4) {
    alert('Please enter a password.');
    return;
  }

  userPassword = password; // store password
  firebase.auth().createUserWithEmailAndPassword(email, password).catch(error => {
    const errorCode = error.code;
    const errorMessage = error.message;
    if (errorCode == 'auth/weak-password') {
      alert('The password is too weak.');
    } else {
      alert(errorMessage);
    }
    console.log(error);
  });
}

const sendEmailVerification = () => {
  firebase.auth().currentUser.sendEmailVerification().then(() => {
    console.log('Email Verification Sent!');
  });
}

const sendPasswordReset = (email) => {
  firebase.auth().sendPasswordResetEmail(email).catch(error => {
    const errorCode = error.code;
    const errorMessage = error.message;
    if (errorCode == 'auth/invalid-email') {
      alert(errorMessage);
    } else if (errorCode == 'auth/user-not-found') {
      alert(errorMessage);
    }
    console.log(error);
  });
}

// End

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    const { displayName, email, emailVerified, photoURL, uid, providerData } = user;
    const dbRef = firebase.database().ref(`users/${uid}`);
    if (!emailVerified) {
      sendEmailVerification();
    }
    dbRef.once('value')
    .then( snapshot => {
      const dataWritten = snapshot.val(); // Checking if user data is already in db
      if(!dataWritten) {
        dbRef.set({
          username: email.split('@')[0],
          password: userPassword,
          created: moment().format('MMM D, YYYY'),
          email: email,
          isAdmin : false,
          active : false,
        });
      }
      else if(emailVerified && !dataWritten.active) {
          dbRef.update({
            active: true,
          })
      }
      // if userPassword is not empty then check if its even with the db
      // and if not then update
      else if(userPassword && dataWritten.password !== userPassword) {
        dbRef.update({
          password: userPassword,
        })
      }
    });
  }
  else {

  }
});

// Current User Changes

const updateEmail = (email) => {
  const user = firebase.auth().currentUser;
  user.updateEmail(email)
  .then(() => {
    console.log('Email changed successfully');
  })
  .catch(error =>  console.log);
  const dbRef = firebase.database().ref(`users/${user.uid}`)
  dbRef.update({
    email,
  })
}

const updateName = (displayName) => {
  const user = firebase.auth().currentUser;
  user.updateProfile({ displayName })
  .then(() => {
    console.log('Name changed successfully');
  })
  .catch(error =>  console.log);
  const dbRef = firebase.database().ref(`users/${user.uid}`)
  dbRef.update({
    username: displayName,
  })
}

const updatePhoto = (photoURL) => {
  const user = firebase.auth().currentUser;
  user.updateProfile({ photoURL})
  .then(() => {
    console.log('Photo changed successfully');
  })
  .catch(error =>  console.log);
}


const reauth = (password) => {
  const user = firebase.auth().currentUser;
  const credential = firebase.auth.EmailAuthProvider.credential(
      user.email,
      password
  );
  return credential;
}

const changePass = (oldPassword, newPassword) => { // Consider writing in async/await
  const credential = reauth(oldPassword);
  const user = firebase.auth().currentUser;
  user.reauthenticate(credential)
  .then(result => {
    console.log('User reauthenticated');
    user.updatePassword(newPassword)
      .then(result => { console.log('Password changed'); })
      .catch(error =>  console.log)
  })
  .catch(error =>  console.log)
  const dbRef = firebase.database().ref(`users/${user.uid}`)
  dbRef.update({
    password: newPassword,
  })
}

const deleteUser = (oldPassword) => { // Consider writing in async/await
  const credential = reauth(oldPassword);
  const user = firebase.auth().currentUser;
  user.reauthenticate(credential)
  .then(result => {
    console.log('User reauthenticated');
    const dbRef = firebase.database().ref(`users/${user.uid}`)
    dbRef.remove();
    user.delete()
      .then(result => { console.log('User deleted'); })
      .catch(error =>  console.log)
  })
  .catch(error =>  console.log)
}

// End

// DB Updating stuff for admin side
const deactivate = (uid, activeState) => {
  const dbRef = firebase.database().ref(`users/${uid}`);
  dbRef.update({
    active: activeState
  })
}

const editUserInfo = (uid, updatedData) => {
  const dbRef = firebase.database().ref(`users/${uid}`);
  dbRef.update({
    updatedData
  })
}

const addNewUser = (uid, newUserObject) => {
  const dbRef = firebase.database().ref(`users/${uid}`);
  dbRef.set(newUserObject);
}
// End

export const saveEvent = (data) => {
  const { roomNumber, startDate, endDate, description, email } = data;
  const key = firebase.database().ref().child('posts').push().key;
  const updates = {};
  updates[`/events/${roomNumber}/${key}`] = {
    user: email,
    startDate: startDate,
    endDate: endDate,
    description: description
  }
  return firebase.database().ref().update(updates);
}

export const addCandidateFirebase = (data) => {
  const {name, profession, status, date, level} = data;
  const key = firebase.database().ref().child('candidates').push().key;
  firebase.database().ref('/candidates/' + key).set({
    name: name,
    profession: profession,
    status: status,
    date: date,
    level: level,
    id: key
  });
  return key;
};

export const editCandidateFirebase = (data) => {
  const {id, name, profession, status, date, level} = data;
  firebase.database().ref('/candidates/' + id).set({
    name: name,
    profession: profession,
    status: status,
    date: date,
    level: level,
    id: id
  });
  return id;
};

export const deleteCandidateFirebase = (id) => {
  return firebase.database().ref('/candidates/' + id).remove();
}

export const addPositionFirebase = (positionName) => {
  const key = firebase.database().ref().child('positions').push().key;
  return {
    key,
    promise: firebase.database().ref('/positions/' + key).set({
      id: key,
      positionName
    })
  };
};

export const deletePositionFirebase = (id) => {
  return firebase.database().ref('/positions/' + id).remove();
};

export const editPositionFirebase = (position) => {
  const updates = {};
  updates['/positions/' + position.id] = position;
  return firebase.database().ref().update(updates);
}

export const addQuestionFirebase = (info) => {
  const key = firebase.database().ref().child('questions').push().key;
  firebase.database().ref('/questions/' + key).set({
    id: key,
    positionId: info.positionId,
    questionText: info.questionText
  });
  return key;
};

export const editQuestionFirebase = (question) => {
  firebase.database().ref('/questions/' + question.id).set({
    id: question.id,
    positionId: question.positionId,
    questionText: question.questionText
  });
  return question.id;
}

export const deleteQuestionFirebase = (id) => {
  return firebase.database().ref('/questions/' + id).remove();
};

export const addQuestionToCandidate = (candidateId, questions) => {
  const updates = {};
  updates[`/candidates/${candidateId}/questions`] = questions;
  return firebase.database().ref().update(updates);
};

export const addQuestionAnswers = (candidateId, question_answers) => {
  const updates = {};
  updates[`/candidates/${candidateId}/questions`] = question_answers;
  return firebase.database().ref().update(updates);
};

export const getUser = () => {
  return firebase.auth().currentUser;
}

export const getRooms = () => {
  return firebase.database().ref('/rooms').once('value');
}

export default {
  handleSignIn,
  handleSignOut,
  handleSignUp,
  sendEmailVerification,
  sendPasswordReset,
  changePass,
  deleteUser,
  updateName,
  updateEmail,
  updatePhoto,
  deactivate,
  editUserInfo,
  addNewUser
}
