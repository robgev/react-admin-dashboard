import React from 'react';
import ReactDOM from 'react-dom';
import LoginSignup from './LoginSignup';
import Candidates from './Candidates';
import CustomQuestions from './CustomQuestions';
import injectTapEventPlugin from 'react-tap-event-plugin';
import '../../scss/hrHome.sass';

export default
class ResourceManager extends React.PureComponent {
  constructor(){
    super();
    injectTapEventPlugin();
  }

  render() {

    return(
      <div className="mainhrApp">
        <Candidates />
      </div>
    )
  }
}
