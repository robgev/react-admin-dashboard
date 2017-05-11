import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {findIndex} from 'lodash';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

import {addQuestionAnswers} from '../firebaseAPI';
import {addCandidateQuestions} from '../../actions/candidate.action';

function mapStateToProps({candidates, questions}) {
  return {candidates, questions};
};

class CandidateInterviewHomepage extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      questions: props.candidates[props.match.params.candidateId].questions
    };
  };
  render() {
    return(
      <div className='interview-homepage'>
        {
          this.state.questions.map(question => {
            return(
              <TextField
                key={question.questionId}
                name={question.questionId}
                fullWidth
                floatingLabelText={this.props.questions[question.questionId].questionText}
                value={question.answer}
                onChange={(e) => {
                  const questions = this.state.questions.slice();
                  const index = findIndex(questions, {questionId: question.questionId});
                  questions[index].answer = e.target.value;
                  this.setState({questions});
                }}
              />
            )
          })
        }
        <RaisedButton
          style={margined}
          label='cancel'
          containerElement={<Link to='/management' />}
        />
        <RaisedButton
          style={margined}
          primary
          label='save'
          onTouchTap={() => {
            addQuestionAnswers(this.props.match.params.candidateId, this.state.questions)
              .then(this.props.addCandidateQuestions(this.props.match.params.candidateId, this.state.questions))
          }}
          containerElement={<Link to='/management' />}
        />
      </div>
    )
  }
}

const margined = {margin: 5};

export default connect(mapStateToProps, {addCandidateQuestions})(CandidateInterviewHomepage);
