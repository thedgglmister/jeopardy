import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';






const prodConfig = {
  apiKey: process.env.REACT_APP_PROD_API_KEY,
  authDomain: process.env.REACT_APP_PROD_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_PROD_DATABASE_URL,
  projectId: process.env.REACT_APP_PROD_PROJECT_ID,
  storageBucket: process.env.REACT_APP_PROD_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_PROD_MESSAGING_SENDER_ID,
};

const devConfig = {
  apiKey: process.env.REACT_APP_DEV_API_KEY,
  authDomain: process.env.REACT_APP_DEV_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DEV_DATABASE_URL,
  projectId: process.env.REACT_APP_DEV_PROJECT_ID,
  storageBucket: process.env.REACT_APP_DEV_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_DEV_MESSAGING_SENDER_ID,
};

const config =
  process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

class Firebase {
  constructor() {
    app.initializeApp(config);

    this.auth = app.auth();
    this.db = app.database();

    this.doCreateUserWithEmailAndPassword = this.doCreateUserWithEmailAndPassword.bind(this);
    this.doSignInWithEmailAndPassword = this.doSignInWithEmailAndPassword.bind(this);
    this.doSignOut = this.doSignOut.bind(this);
    this.doPasswordReset = this.doPasswordReset.bind(this);
    this.doPasswordUpdate = this.doPasswordUpdate.bind(this);
    this.user = this.user.bind(this);
    this.users = this.users.bind(this);
    this.createNewGameId = this.createNewGameId.bind(this);
    this.game = this.game.bind(this);

  }



  // *** Auth API *** //

  doCreateUserWithEmailAndPassword = function(email, password) {
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  doSignInWithEmailAndPassword = function(email, password) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  doSignOut = function() {
    return this.auth.signOut();
  }

  doPasswordReset = function(email) {
    return this.auth.sendPasswordResetEmail(email);
  }

  doPasswordUpdate = function(password) {
    return this.auth.currentUser.updatePassword(password);
  }



  // *** User API *** //

  user = function(uid) {
    return this.db.ref(`users/${uid}`);
  }

  users = function() {
    return this.db.ref('users');
  }



  // *** Categories API *** //

  myCategories = function(uid) {
    const ref = this.db.ref('categories');
    console.log(334);
    console.log(ref);

    return ref
            .orderByChild('creatorUid')
            .startAt(uid).endAt(uid);
  }

  category = function(categoryId) {
    const ref = this.db.ref('categories').child(categoryId);
    console.log(335);
    console.log(ref);

    return ref;
  }

  createCategory = function(categoryObj, questions) {
    const categoriesRef = this.db.ref('categories');

    const newCategoryRef = categoriesRef.push();
    newCategoryRef.set(categoryObj);
    console.log(111);
    questions.forEach((question) => {
      newCategoryRef.child('questions').push(question);
    });
    console.log(222);


    return newCategoryRef;
  }


  editCategory = function(categoryId, categoryObj) {
    const categoryRef = this.db.ref('categories').child(categoryId);


    return categoryRef.set(categoryObj);

  }



  // *** Games API *** //

  createNewGameId = function() {
    const gamesRef = this.db.ref('games');
    const gameRef = gamesRef.push({
      gameStatus: 'New',
    });
    return gameRef.key;
  }

  game = function(gameId) {
    const gameRef = this.db.ref('games').child(gameId);
    return gameRef;
  }



  // ** Players API ** //

  startHosting = function(gameId, uid) {
    const ref = this.db.ref();

    const currentGameUpdate = {
      gameId: gameId,
      role: 'host',
    };

    const gameHostUpdate = {
      uid: uid,
    };

    const updates = {}
    updates[`games/${gameId}/host`] = gameHostUpdate;
    updates[`users/${uid}/currentGame`] = currentGameUpdate;

    return ref.update(updates);
  }

  stopHosting = function(gameId, uid) {
    const ref = this.db.ref();

    const currentGameUpdate = null;
    const gameHostUpdate = null;

    const updates = {}
    updates[`games/${gameId}/host`] = gameHostUpdate;
    updates[`users/${uid}/currentGame`] = currentGameUpdate;

    return ref.update(updates);
  }

  startPlaying = function(gameId, playerNumber, uid) {
    const ref = this.db.ref();

    const currentGameUpdate = {
      gameId: gameId,
      role: playerNumber,
    };

    const gamePlayerUpdate = {
      uid: uid,
      score: 0,
    };

    const updates = {}
    updates[`games/${gameId}/${playerNumber}`] = gamePlayerUpdate;
    updates[`users/${uid}/currentGame`] = currentGameUpdate;

    return ref.update(updates);
  }

  stopPlaying = function(gameId, playerNumber, uid) {
    console.log(887);
    console.log(playerNumber, uid, gameId);

    const ref = this.db.ref();

    const currentGameUpdate = null;
    const gamePlayerUpdate = null;

    const updates = {}
    updates[`games/${gameId}/${playerNumber}`] = gamePlayerUpdate;
    updates[`users/${uid}/currentGame`] = currentGameUpdate;
    console.log(updates);


    return ref.update(updates);
  }






  // *** Merge Auth and DB User API *** //

  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      console.log(333999);
      if (authUser) {
        this.user(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = {};
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser,
            };

            next(authUser);
          });
      }
      else {
        fallback();
      }
    });








}

export default Firebase;
