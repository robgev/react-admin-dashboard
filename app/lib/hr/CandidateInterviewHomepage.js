import React from 'react';
import SelectField from 'material-ui/SelectField';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import {orange500, blue500} from 'material-ui/styles/colors'
import TextField from 'material-ui/TextField';
import Timer from 'react-timer';
import Dialog from 'material-ui/Dialog';

class CandidateInterviewHomepage extends React.PureComponent {
  constructor(){
    super();
    this.state={
      timerShow: false
    }
  }

  render() {
    const OPTIONS = { prefix: 'seconds elapsed!', delay: 1000};

    const TimerNow = () => {
      this.setState({timerShow:true})
      console.log('timer triggered')
    };

    const Questions = () => {
      return (
        <div>
          {
            this.props.questions.map(question => {
              return (
                <TextField
                  key={question.id}
                  floatingLabelText={question.question}
                  fullWidth
                />
              )
            })
          }
        </div>
      )
    }

    const actions = [
      <FlatButton
        label="cancel"
        primary
        onTouchTap={this.props.closeInterviewScreen}
      />,
      <FlatButton
        label="save"
        primary
        onTouchTap={this.props.saveInterview}
      />
    ];

    const AdditionalComments = () => {
      return (
        <TextField
          hintText="Comments"
          floatingLabelText="Additional Comments"
          multiLine
          rows={4}
        />
     )}
    return(

      <Dialog
        actions={actions}
        onRequestClose={this.props.closeInterviewScreen}
        modal={false}
        autoScrollBodyContent
        title="Interview Screen"
        open  >
        <FlatButton
            className="forTimer"
            label="Start the Timer"
            onClick={TimerNow}
            />
              {
          this.state.timerShow ?
          <div>
            <Timer options={OPTIONS} />
          </div>

          : null
        }
        <Questions />
        <AdditionalComments />
      </Dialog>
    )
  }
}

export default CandidateInterviewHomepage;
