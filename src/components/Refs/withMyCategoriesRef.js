import React from 'react';
import { compose } from 'recompose';

import LoadingScreen from '../Loading';
import { withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';


const withMyCategoriesRef = (Component) => {

  class WithMyCategoriesRef extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        loading: true,
      }
    }

    componentDidMount() {
      const { firebase } = this.props;
      const { uid } = this.props.authUser;
      console.log(1331313);
      console.log(uid);
      this.myCategoriesRef = firebase.myCategories(uid);
      this.myCategoriesRef.on('value', (snapshot) => {
        console.log(34343);

        console.log(snapshot.val())
        const myCategories = Object.assign({}, snapshot.val());
        this.setState({
          loading: false,
          myCategories: myCategories,
        });
      });
    }

    componentWillUnmount() {
      this.myCategoriesRef.off();
    }

    render() {
      const { loading, myCategories } = this.state;
      console.log(88080808);
      console.log(myCategories)
      return (
        <div>
          {loading && <LoadingScreen />}
          {!loading && <Component {...this.props} myCategories={myCategories} />}
        </div>
      );
    }
  }

  const condition = authUser => !!authUser;

  return compose(
    withFirebase,
    withAuthorization(condition)
  )(WithMyCategoriesRef);
};

export default withMyCategoriesRef;
