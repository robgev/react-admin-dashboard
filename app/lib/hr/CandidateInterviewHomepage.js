import React from 'react';
import {findIndex} from 'lodash';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {addQuestionAnswers} from '../firebaseAPI';
import {addCandidateQuestions} from '../../actions/candidate.action';

function mapStateToProps(state) {
  return (
    {
      candidates: state.candidates,
      questions: state.questions
    }
  );
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
      <div style={styles.container}>
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
        <FlatButton
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

const styles = {
  container: {
    display: 'flex',
    height: '90vh',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '70%',
    margin: '0 auto',
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  }
}

export default connect(mapStateToProps, {addCandidateQuestions})(CandidateInterviewHomepage);
