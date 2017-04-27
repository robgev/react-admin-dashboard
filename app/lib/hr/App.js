import React from 'react';
import {connect} from 'react-redux';
import {Switch, Route, Link} from 'react-router-dom';
import firebase from 'firebase';

import Header from '../ur/components/Header';
import Footer from '../ur/components/Footer';

import Candidates from './Candidates';
import CustomQuestions from './CustomQuestions';
import MakeInterviewList from './MakeInterviewList';
import CandidateInterviewHomepage from './CandidateInterviewHomepage';

import {setInitialPositions} from '../../actions/positions.action';
import {setInitialQuestions} from '../../actions/questions.action';

import FlatButton from 'material-ui/FlatButton';

function mapStateToProps(state) {
  return (
    {
      positions: state.positions,
      questions: state.questions
    }
  )
};

class ResourceManager extends React.PureComponent {
  componentWillMount() {
    firebase.database().ref('positions').once('value').then(snapshot => {
      const positions = snapshot.val();
      if (positions){
        this.props.setInitialPositions(positions);
      }
    });
    firebase.database().ref('questions').once('value').then(snapshot => {
      const questions = snapshot.val();
      if(questions){
        this.props.setInitialQuestions(questions);
      }
    });
  };

  render() {
    const {url} = this.props.match.match;
    return(
      <div>
        <div className={'hrUIButtons'}>
          <FlatButton
            label='candidates'
            containerElement={<Link to={url} />}
            primary
          />
          <FlatButton
            label='questions'
            containerElement={<Link to={url + '/questions'} />}
            primary
          />
        </div>
        <Header
          user={this.props.user}
          admin={this.props.admin}
          signOut={this.props.signOut}
        />
        <Switch>
          <Route path={url + '/questions'} component={CustomQuestions} />
          <Route path={url + '/interview/:candidateId'} component={MakeInterviewList} />
          <Route path={url + '/candidateInterview/:candidateId'} component={CandidateInterviewHomepage} />
          <Route path={url + '/'} component={Candidates} />
        </Switch>
        <Footer />
      </div>
    )
  }
}

export default connect(mapStateToProps, {setInitialPositions, setInitialQuestions})(ResourceManager);
