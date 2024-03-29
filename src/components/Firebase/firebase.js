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

console.log(5555555555);
console.log(process.env.ENVIRONMENT);

const config =
  process.env.ENVIRONMENT === 'production' ? prodConfig : devConfig;

console.log(config);

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


  // *** Top Level Ref *** //
  ref = function() {
    return this.db.ref();
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
    const myCategoriesRef = this.db.ref(`myCategories/${uid}`);
    return myCategoriesRef;
    // console.log(334);
    // console.log(ref);
    //
    // return ref
    //         .orderByChild('creatorUid')
    //         .startAt(uid).endAt(uid);
  }

  category = function(categoryId) {
    const ref = this.db.ref('categories').child(categoryId);
    console.log(335);
    console.log(ref);

    return ref;
  }

  createCategory = function(categoryObj) {
    console.log(777111);
    const ref = this.db.ref();

    const categoriesRef = ref.child('categories');
    const newCategoryRef = categoriesRef.push();
    const categoryPushKey = newCategoryRef.key;

    const questionsClone = {};
    for (let questionId in categoryObj.questions) {
      const question = categoryObj.questions[questionId];
      const newQuestionRef = newCategoryRef.child('questions').push();
      const questionPushKey = newQuestionRef.key;
      question.questionId = questionPushKey;
      question.categoryId = categoryPushKey;
      questionsClone[questionPushKey] = question;
    }
    categoryObj.questions = questionsClone;

    const creatorUid = categoryObj.creatorUid;
    const updates = {};
    updates[`categories/${categoryPushKey}`] = categoryObj;
    updates[`myCategories/${creatorUid}/${categoryPushKey}`] = categoryObj;

    return ref.update(updates);
  }


  editCategory = function(categoryObj) {
    console.log(77772222);
    const ref = this.db.ref();
    const { categoryId, creatorUid } = categoryObj;

    const updates = {};
    updates[`categories/${categoryId}`] = categoryObj;
    updates[`myCategories/${creatorUid}/${categoryId}`] = categoryObj;

    return ref.update(updates);
  }


  newGameCategories = function(categoryId, categoryObj) {
    const newGameCategoriesRef = this.db.ref('categories').orderByChild('complete').equalTo(true).limitToFirst(12);
    return newGameCategoriesRef;
  }



  gameCategories = function(gameId) {
    const gameCategoriesRef = this.db.ref('gameCategories').child(gameId);
    return gameCategoriesRef;
  }

  // *** Answers API *** //


  answers = function(gameId) {
    const answersRef = this.db.ref('answers').child(gameId);
    return answersRef;
  }


  // *** Questions API *** //

  activeQuestionByGame = function(gameId) {
    const activeQuestionRef = this.db.ref(`activeQuestionsByGame/${gameId}`);
    return activeQuestionRef;
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

  currentGame = function(uid) {
    const currentGameRef = this.db.ref('currentGames').child(uid);
    return currentGameRef;
  }


  startPlaying = function(gameId, role, uid, base64Signature) {
    const ref = this.db.ref();

    const currentGameUpdate = {
      gameId: gameId,
      role: role,
    };

    const gameRoleUpdate = {
      uid: uid,
      base64Signature: base64Signature
    };

    const updates = {}
    updates[`games/${gameId}/${role}`] = gameRoleUpdate;
    updates[`currentGames/${uid}`] = currentGameUpdate;

    return ref.update(updates);
  }

  stopPlaying = function(gameId, role, uid) {
    const ref = this.db.ref();

    const currentGameUpdate = null;
    const gameRoleUpdate = null;

    const updates = {}
    updates[`games/${gameId}/${role}`] = gameRoleUpdate;
    updates[`currentGames/${uid}`] = currentGameUpdate;

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
