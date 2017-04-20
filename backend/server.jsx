'use strict';

import * as admin from "firebase-admin";

const serviceAccount = require('./serviceAccountKey.json');
const express = require('express');
const app = express();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://apollobytes-internal.firebaseio.com"
});
app.use(express.static('public'));

app.listen(8080);
