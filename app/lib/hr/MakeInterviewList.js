import React from 'react';
import {connect} from 'react-redux';
import {map, filter, find, findIndex} from 'lodash';
import {Table, TableBody, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn} from 'material-ui/Table';
import {addQuestionToCandidate} from '../firebaseAPI';
import FlatButton from 'material-ui/FlatButton';
import {addCandidateQuestions} from '../../actions/candidate.action';
import {Link} from 'react-router-dom';

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
      candidateQuestions: this.props.candidates[this.props.match.params.candidateId].questions || []
    }
  };
  selectedCandidate = this.props.candidates[this.props.match.params.candidateId];
  allQuestions = filter(this.props.questions, {positionId: this.selectedCandidate.profession});
  render() {
    const selectedQuestions = this.state.candidateQuestions.map(question => {
      return this.props.questions[question.questionId];
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
            <TableBody deselectOnClickaway={false}>
              {
                this.allQuestions.map(question => {
                  return(
                    <TableRow
                      key={question.id}
                      selected={!!find(this.state.candidateQuestions, {questionId: question.id})}
                      onTouchTap={() => {
                        if(!find(this.state.candidateQuestions, {questionId: question.id})){
                          const candidateQuestions = [...this.state.candidateQuestions,
                          {answer: '', questionId: question.id}];
                          this.setState({candidateQuestions});
                        } else {
                          let candidateQuestions = this.state.candidateQuestions.slice();
                          const index = findIndex(candidateQuestions, {questionId: question.id});
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
          <Table selectable={false}>
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
            containerElement={<Link to='/management' />}
          />
        </div>
      </div>
    );
  };
};

export default connect(mapStateToProps, {addCandidateQuestions})(MakeInterviewList);
