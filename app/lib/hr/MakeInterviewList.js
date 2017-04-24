import React from 'react';
import {connect} from 'react-redux';
import {map, filter} from 'lodash';
import {Table, TableBody, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn} from 'material-ui/Table';
import {addQuestionToCandidate} from '../firebaseAPI';
import FlatButton from 'material-ui/FlatButton';
import {addCandidateQuestions} from '../../actions/candidate.action';

function mapStateToProps(state) {
  return (
    {
      questions: state.quesitons
    }
  );
};

class MakeInterviewList extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      candidateQuestions: []
    }
  };
  render() {
    const allQuestions = filter(this.props.questions, {positionId: this.state.candidate.profession});
    const selectedQuestions = this.state.candidateQuestions.map(questionId => {
      return this.props.questions.questionId;
    });
    return(
      <div>
        <div
          style={{width: '50%'}}
        >
          <Table>
            <TableHeader>
              <TableHeaderColumn>
                Questions
              </TableHeaderColumn>
            </TableHeader>
            <TableBody>
              {
                allQuestions.map(question => {
                  return(
                    <TableRow
                      key={question.id}
                      onTouchTap={() => {
                        const candidateQuestions = [...this.state.candidateQuestions, question.id];
                        this.setState({candidateQuestions});
                      }}
                    >
                      <TableRowColumn>
                        {question.questionText}
                      </TableRowColumn>
                    </TableRow>
                  );
                });
              }
            </TableBody>
          </Table>
        </div>
        <div
          style={{width: '50%'}}
        >
          <Table>
            <TableHeader>
              <TableHeaderColumn>
                Selected Questions
              </TableHeaderColumn>
            </TableHeader>
            <TableBody>
              {
                selectedQuestions.map(question => {
                  <TableRow
                    key={question.id}
                    onTouchTap={() => {
                      let candidateQuestions = this.state.candidateQuestions.slice();
                      const index = candidateQuestions.indexOf(question.id);
                      candidateQuestions.splice(index, 1);
                      this.setState({candidateQuestions});
                    }}
                  >
                    <TableRowColumn>
                      {question.questionText}
                    </TableRowColumn>
                  </TableRow>
                })
              }
            </TableBody>
          </Table>
          <FlatButton
            label='save'
            onTouchTap={() => {
              addQuestionToCandidate(this.props.candidate.id, this.state.candidateQuestions)
                .then(this.props.addCandidateQuestions(this.props.candidate.id, this.state.candidateQuestions))
            }}
          />
        </div>
      </div>
    );
  };
};

export default connect(mapStateToProps, {addCandidateQuestions})(MakeInterviewList);
