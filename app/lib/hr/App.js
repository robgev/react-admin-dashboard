import React from 'react';
import ReactDOM from 'react-dom';
import LoginSignup from './LoginSignup';
import Candidates from './Candidates';
import CustomQuestions from './CustomQuestions';
import CustomQuestions1 from './CustomQuestions1';
import injectTapEventPlugin from 'react-tap-event-plugin';
import '../../scss/hrHome.sass';
import Header from '../ur/components/Header';
import Footer from '../ur/components/Footer';

export default
class ResourceManager extends React.PureComponent {

  render() {

    return(
      <div className="hrBody mainhrApp">
        <Header
          user={this.props.user}
          admin={this.props.admin}
          signOut={this.props.signOut}
        />
        <CustomQuestions1 />
        <Footer />
      </div>
    )
  }
}
