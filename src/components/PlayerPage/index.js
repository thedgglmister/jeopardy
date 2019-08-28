import React, { Component } from 'react';
import { compose } from 'recompose';


import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';
import StopPlayingButton from './stopPlayingButton';
import * as ROUTES from '../../constants/routes';



class PlayerPageBase extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: true,
    };

    this.stopPlaying = this.stopPlaying.bind(this);

  }


  componentDidMount() {

    const { gameId, playerNumber } = this.props.match.params;

    this.gameRef = this.props.firebase.game(gameId);



    this.gameRef.on('value', (snapshot) => {
      const game = Object.assign({gameId: gameId}, snapshot.val());
      let errorMsg = null;
      let waiting = false;
      const { gameStatus, host, p1, p2, p3 } = game;
      const myPlayer = game[playerNumber];

      // const userRef = this.props.firebase.user(this.props.authUser.uid);
      // userRef.once('value', (snapshot) => {
      //   console.log(33888);
      //   const user = snapshot.val();
      //   console.log(gameId);
      //   console.log(user.currentGame.gameId);
      //   console.log(playerNumber)
      //   console.log(user.currentGame.role)
      //
      //   console.log(user.currentGame.gameId != gameId);
      //   console.log(user.currentGame.role != playerNumber);
      //   console.log(user.currentGame && (user.currentGame.gameId != gameId || user.currentGame.role != playerNumber))
      //
      //
      //   if (user.currentGame && (user.currentGame.gameId != gameId || user.currentGame.role != playerNumber)) {
      //     console.log(339999);
      //     this.setState({
      //       loading: false,
      //       errorMsg: `You're already playing in another game, or as a different role in this game`,
      //     });
      //   }
      // })

      if (!gameStatus || (playerNumber != 'p1' && playerNumber != 'p2' && playerNumber != 'p3')) {
        errorMsg = "I think you're in the wrong place";
      }
      else if (gameStatus == 'Finished') {
        errorMsg = "This game has already finished";
      }
      else if (!myPlayer) {
        this.props.firebase.startPlaying(gameId, playerNumber, this.props.authUser.uid)
          .catch((error) => {
            this.setState({
              loading: false,
              errorMsg: error.message ? error.message : "Something went wrong",
            });
          });
        return;
      }
      else if (myPlayer.uid != this.props.authUser.uid) {
        errorMsg = `This game already has a Player ${playerNumber[1]}`;
      }
      else if (gameStatus == "New" && !(host && p1 && p2 && p3)) {
        waiting = true;
      }
      this.setState({
        loading: !myPlayer && !errorMsg,
        errorMsg: errorMsg,
        game: game,
        waiting: waiting,
      });
    });
  }

  componentWillUnmount() {
    this.gameRef.off();
  }

  stopPlaying() {
    this.gameRef.off();
    const { gameId, playerNumber } = this.props.match.params;
    const { uid } = this.props.authUser;
     this.props.firebase.stopPlaying(gameId, playerNumber, uid)
      .then(() => {
        this.props.history.push(ROUTES.HOME);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  render() {
    const { loading, errorMsg, game, waiting } = this.state;
    return (
      <div>
        NEED TO PREVENT SOMONE FROM HAVING TWO ROLES. CANT HOST AND BE P2.
        Need to figure out what to do if stop playing when game is active.


        EACH SCREEN NEEDS ITS OWN REF(S). SO DENORMALIZE LIKE THAT? SO THE SIGN UP LINKS SCREEN NEEDS THE GAME REF. HOME SCREEN NEEDS THE REF WITH THE CURRENT GAME INFO. THE GAME SCREEN NEEDS THE REF TO EACH OF THE COLUMN, ETC.
        BUT I DONT WANT THE LOADING DELAY EACH REFRESH. SO NEED TO HOIST IT UP THE COMPONENT?

        SIMPLIFY THESE CONDITIONAL RENDERS. IT SHOULD BE IF LOADING, "LOADING", IF ERROR MSG, "ERROR MSG", IF WAITING, "WAITING", AND IF ACTIVE, "ACTIVE". IF LEAVE OPTION, SHOW STOP PLAYING BUTTON. PUT ALL THE LOGIC IN THE RENDER CONDITIONALS INTO JAVASCRIPT AND THE STATE. PUT THE STOP PLAYING AND STOP HOSTING BUTTONS IN THE ACTIVE. STOP PLAYING BUTTON SHOULD HAVE AS A PROP WHETHER IT SHOULD ALLOW WITHOUT ENDING GAME, IT SHOULD BE IF THE GAME IS ACTIVE, BUT DO THE LOGIC IN JAVASCRIPT.
        SLOW DOWN. THINK ABOUT THE INTUITIVE WAY TO DO IT. WHAT DO EACH OF THESE COMPONENTS NEED TO KNOW AND WHAT DEFINES THEM?

        WOAH WOAH WOAH. HERE'S WHAT I NEED TO DO. DEFINE PERMISSIONS SYSTEM. LIKE THE ROLES THING FOR ADMIN. THEN HAVE A WITH AUTHORIZATION TYPE THING THAT IS ACTUALLY WITH CURRENT GAME. SO EACH COMPONENT WITH ONE OF THESE WRAPPERS MAKES SURE THAT YOUR THE PERSON WHO IS SUPPOSED TO BE SEEING IT, OTHERWISE IT GIVES YOU A MESSAGE. NEED TO MAKE SURE IT WOUDL WORK TO MAKE SURE YOU DONT HAVE TWO ROLES AT ONCE.
        DONT DO HAVE THE SAME URL. FOR SIGNING INTO A GAME AND THE PLAYER PAGE. HAVE THE SCAN DO A GET TO A URL. THAT RETURNS A COMPONENT THAT HAS A LOADING SCREEN UNTILL IT FINISHES SAVING YOUR NEW GAME DATA, THEN IT ROUTES YOU TO THE GAME. THE SIGN UP, REDIRECTING COMPONENT MAKES SURE NO ONE IS ALREADY IN THE SLOT. THE PLAYER PAGE MAKES SURE YOUR THE PERSON WHO SHOULD BE THERE. BOTH SHOW APPRPRIATE MESSAGES IF ITS WRONG.

        RETHINK URL STUFF BEFORE CONTINUING

        MAKE SURE YOU THINK THROUGH THE WHOLE SIGN UP LINKS SCREEN IS THE SAME AS THE BOARD URL. WHAT NEEDS TO BE AVAILABE TO PEOPLE AND WHEN, URLS THAT IS. WHAT DO THEY NEED TO BE ABLE TO REACH, AND HOW WILL THEY REACH IT. DONT THINK IN TERMS OF URLS, THINK IN TERMS OF AN APP WITH A MENU OF CHOICES. YOU DONT GO TO THE SAME URL TO LOG INTO A SLOT AND BE ACTIVE. THEY NEED TO SEE A SIGN UP BUTTON OR A CURRENT ROLE BUTTON. OR A NEW GAME BUTTON. HAVE THE HOME PAGE BE A BUNCH OF OPTION BUTTONS, AND EACH ONE DETERMINES BASED ON THE STATE WHETHER IT SHOWS UP AT ALL?
        THE LINK TO THE QR CODES NEEDS TO BE SHARABLE. THOSE YOU CLICK OR SCAN.


        SHOULD I USE URLS AT ALL? OR JUST KEEP TRACK OF STATE FROM THE BUTTONS YOU'VE CLICKED. YOU CLOSE YOUR WINDOW, THE URL IS GONE BUT WHATEVER. YOU JUST GO BACK TO THE HOME PAGE AND YOUR GIVEN CHOICES. IF YOURE IN A GAME, YOU CAN RESUME AS _____, OR QUIT GAME. THATS IT. IF YOUR NOT IN A GAME YOU CAN EITHER JOIN GAME OR START GAME. IN JOIN GAME YOU CAN SEE INVITATIONS FOR YOU, WHICH WHEN YOU CLICK THEM TAKES YOU TO THE "BOARD" AKA AT THIS POINT THE SCAN IN SCREEN. THESE CAN BE PRESSED TO LOG YOU SAVE THE SLOT AS YOUR CURRENT (OR YOU CAN SCAN IF ITS UP ON THE TV), AND SAVE YOU AS IN THE GAME. THESE INVITES TO THE BOARD HOME PAGE CAN BE SENT.... OR NO!!! ACTUALLY JUST DO SCAN. EVERY ONE NEEDS TO BE AT A BOARD. SO THATS THE URL YOU SEND. THEY CANT PRESS IT. YOU *HAVE* TO SCAN IT, FORCING THE PUBLIC URL TO BE THE BOARD ONE, THEN FROM THERE YOU JUST SCAN IN ON YOUR PHONE. ANYWAY, JOIN GAME IS ONE OPTION, OR CREATE GAME WHICH CREATES ONE AND REDIRECTS YOU TO THE BOARD. ONCE YOU SCAN IN, NOW YOURE STATE IS IN A GAME AND AT BOARD SCREEN. OR ACTUALLY, USE A URL FOR THE BOARD SCREEN, SO THAT SHOULD BE A REDIRECT TO THE BOARD URL. WAIT BUT IS THE WHOLE POINT THAT I DONT WANT TO DO SECURITY LAYERS TO SEE IF YOU CAN BE THERE. THE DATABASE TELLS YOU WHAT YOU SEE. THEN SOME STATE NOT IN DATABASE, LIKE THE SCREEN. HOME, PLAYERPAGE/HOSTPAGE. THESE YOU JUST START OVER AT HOME AND THEN SELECT YOU WANT TO GO TO PLAYERPAGE. ITS ONE CLICK.
        OK HERES HOW IT SHOULD WORK. YOU NEED TO BE ABLE TO SEND THE BOARD URL TO PEOPLE. HOW? JUST BUTTON WITH AN EMAIL ADDRESS INPUT FOR NOW? ITS NOT THAT IMPORTANT OF A FEATURE. MOSTLY PEOPLE WILL BE WITH THE PERSON WHO INITIATED THE GAME. NEED AN OPTION TO GO TO BOARD SCREEN FROM YOUR HOME, AND FROM BOARD AN OPTION TO GO BACK HOME. AS LONG AS YOUR IN A GAME THAT IS. (BTW, WHEN YOUR IN A GAME, LOAD UP REF RIGHT AWAY IN APP, AND PADD IT DOWN TO THE PAGES VIA THE ROUTES.) ALSO NEED TO ALWAYS ALLOW FOR CATEGORY CREATION ON HOME SCREEN. EACH OF THESE SHOULD HAVE ITS CONDITIONAL RENDERING LOGIC INTERNAL TO IT.
        ***THE BOARD HAVE A NOT ENOUGH PLAYERS STATE IN BEGINNING IS ACTUALLY GOOD. ITS NOT TWO DIFFERNT SCREENS, ITS TWO DIFFERENT STATES OF THE THING THAT NEEDS TO BE SHARABLE.

        BTW,THE PLAYER PAGE DOESNT NEED MUCH, JUST A THING TO WRITE NAMES. PUT A TIMER ON BOARD COMPONENT WHEN THE HOST CLICKS TIMER ON THAT IT TRIGGERS 30 SECEOND COUNTDOWN ON BAORD AN THEN CHANGES DATABASE BACK TO WRITINGNAMES == FALSE. AND THEN ALSO A BUZZER AND A FINAL JEOPARDY THING. YOU JUST NEED TO KNOW THE GAME AND QUESTION THAT ARE CURRENT. NEED TO SELECT DAILY DOUBLE AMOUNT, VALIDATE THAT. NEED TO GO BACK TO HOME, AND NEED TO EXIT GAME.
        THE HOST PAGE IS MORE COMPLICATED. MAYBE? NEED TO SAY CURRENT ANSWER RECORD WAS WRONG OR RIGHT, PROBABLY SHOW NAME OF PERSON WHO BUZZED IN. SO IT SOUNDS LIKE I NEED A CURRENT SUBMISSION REF, WHICH GETS NULLED OUT WHEN NONE, THEN EVERYTHING LISTENS TO THE REF TO SHOW WHO BUZZED IN FIRST, ETC. BOARD SCREEN CAN SHOW, HOST CAN SEE, PLAYERS CAN TURN GREEN AND RED, ETC.    *AS BONUS, ABILITY TO SELECT QUESTION FROM MINI BOARD ON YOUR PHONE, INSTEAD OF HAVING TO CLICK IT ON BOARD. ABILITY TO HOST NEEDS TO ADD AND REMOVE FROM ANYONE ANY AMMOUNT (TO KEEP THINGS SIMPLE). NEED TO GO BACK TO HOME, AND NEED TO EXIT GAME.

        I DO LIKE USING URLS FOR THE SIGN INTO GAME COMPONENT. AND THAT JUST ROUTES YOU TO THE BOARD URL. SO THE BOARD AND BACK HOME BUTTONS NEED TO USE URLS TO ROUTE, NOT STATE.

        SHOULD IT STOP BOARD DISPLAY WHEN A PLAYER OR HOST GOES TO HOME SCREEN? SAY, WAITING FOR ...

        IF THERE IS A SITE WITH LOTS OF JEOPARDY QUESTIONS, WRITE A SCRAPER TO GET THEM ALL. http://j-archive.com/showseason.php?season=27. JUST NEED TO WORRY ABOUT PHOTO QUESTIONS, ETC. LOOK FOR LINKS IN THE TEXT MAYBE?

        WHY WAS I WORRIED ABOUT THE COUNTDOWN TO BUZZ IN. THE HOSE SHOULD ACTIVATE THE QUESTION RIGHT WHEN THE FINISH. THIS SHOULD CHANGE A LIGHT ON BOARD AND LIGHT UP BUZZERS.

        just need to do a thing  on sign into game component, if its a url, i migh hit back and if theres a host and its me, go home.

        WRITE AN API TO UPLOAD QUESTIONS?

        can do some logic in render. not everyhthign needs to be in state.



        so in conclusion. the scan just sets the database, which will set your state from the listner to the db. this listener sets state to reflect the db, but also sets your state to be at the home screen (using routes sstill, but routes are controlled by the state). or so some logic based on what triggered the listener to decide if you should have state to go into the player screen, or home, or host, or whatever.
        to the board button must be on home. so you can always get back to it.
        need urls for player, but it doesnt need game info. so only need to check if your in a game. if not, then return home. if you are then it shows you player screen.
        i want urls so i can go back in browser to get home as well, etc.
        the only urls with ids in them are the scan in component and the board. these need to handle bad requests. just send them home? or send error msg? 
        {loading && <h1>Loading...</h1>}
        {!loading && errorMsg && <h1>{errorMsg}</h1>}
        {!loading && !errorMsg && waiting && <h1>Waiting for others to join...</h1>}
        {!loading && !errorMsg && <StopPlayingButton onClick={this.stopPlaying} />}
      </div>
    );
    //{!loading && !errorMsg && !waiting && game.gameStatus == 'Active' && <ActiveHostScreen />} //need to handle update within these
  }
};

const condition = authUser => !!authUser;


const PlayerPage = compose(
  withAuthorization(condition),
  withFirebase,
)(PlayerPageBase);

export default PlayerPage;
