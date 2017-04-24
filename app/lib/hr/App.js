import React from 'react';
import ReactDOM from 'react-dom';
import LoginSignup from './LoginSignup';
import Candidates from './Candidates';
import CustomQuestions from './CustomQuestions';
import MakeInterviewList from './MakeInterviewList';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Header from '../ur/components/Header';
import Footer from '../ur/components/Footer';
import {Switch, Route, Link} from 'react-router-dom';
import {Tabs, Tab} from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';

export default
class ResourceManager extends React.PureComponent {
  render() {
    const {url} = this.props.match.match;
    return(
      <div className='hrBody mainhrApp'>
        <Header
          user={this.props.user}
          admin={this.props.admin}
          signOut={this.props.signOut}
        />
        <FlatButton
          label='candidates'
          containerElement={<Link to={url} />}
          linkButton primary
        />
        <FlatButton
          label='questions'
          containerElement={<Link to={url + '/questions'} />}
          linkButton primary
        />
        <Switch>
          <Route path={url + '/questions'} component={CustomQuestions} />
          <Route path={url + '/interview/:candidateId'} component={MakeInterviewList} />
          <Route path={url + '/'} component={Candidates} />
        </Switch>
        <Footer />
      </div>
    )
  }
}
