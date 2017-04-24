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
      questions: state.questions,
      candidates: state.candidates
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
  selectedCandidate = this.props.candidates[this.props.match.params.candidateId];
  allQuestions = filter(this.props.questions, {positionId: this.selectedCandidate.profession});
  render() {
    const selectedQuestions = this.state.candidateQuestions.map(questionId => {
      return this.props.questions[questionId];
    });
    return(
      <div style={{display: 'flex'}}>
        <div
          style={{width: '50%'}}
        >
          <Table adjustForCheckbox multiSelectable>
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>
                  Questions
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                this.allQuestions.map(question => {
                  return(
                    <TableRow
                      key={question.id}
                      onTouchTap={() => {
                        if(!this.state.candidateQuestions.includes(question.id)){
                          const candidateQuestions = [...this.state.candidateQuestions, question.id];
                          this.setState({candidateQuestions});
                        } else {
                          let candidateQuestions = this.state.candidateQuestions.slice();
                          const index = candidateQuestions.indexOf(question.id);
                          candidateQuestions.splice(index, 1);
                          this.setState({candidateQuestions});
                        }
                      }}
                    >
                      <TableRowColumn>
                        {question.questionText}
                      </TableRowColumn>
                    </TableRow>
                  );
                })
              }
            </TableBody>
          </Table>
        </div>
        <div
          style={{width: '50%'}}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>
                  Selected Questions
                </TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {
                selectedQuestions.map(question => {
                  return(
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
                  )
                })
              }
            </TableBody>
          </Table>
          <FlatButton
            label='save'
            onTouchTap={() => {
              addQuestionToCandidate(this.selectedCandidate.id, this.state.candidateQuestions)
                .then(this.props.addCandidateQuestions(this.selectedCandidate.id, this.state.candidateQuestions))
            }}
          />
        </div>
      </div>
    );
  };
};

export default connect(mapStateToProps, {addCandidateQuestions})(MakeInterviewList);
