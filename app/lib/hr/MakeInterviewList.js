import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {map, filter, find, findIndex} from 'lodash';
import {addQuestionToCandidate} from '../firebaseAPI';

import {Table, TableBody, TableHeader, TableHeaderColumn,
  TableRow, TableRowColumn} from 'material-ui/Table';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

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
      candidateQuestions: this.props.candidates[this.props.match.params.candidateId].questions || [],
      allSelected: false
    }
  };
  selectedCandidate = this.props.candidates[this.props.match.params.candidateId];
  allQuestions = filter(this.props.questions, {positionId: this.selectedCandidate.profession});
  render() {
    const selectedQuestions = this.state.candidateQuestions.map(question => {
      return this.props.questions[question.questionId];
    });
    return(
      <div style={styles.container}>
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'row'}}>
          <div>
            <Table
              multiSelectable
              allRowsSelected={this.state.allSelected}
            >
              <TableHeader>
                <TableRow
                  onTouchTap={() => {
                    if(this.state.allSelected) {
                      this.setState({candidateQuestions: [], allSelected: false});
                    } else {
                      let candidateQuestions = [];
                      this.allQuestions.map(question => {
                        candidateQuestions.push({answer: '', questionId: question.id});
                      });
                      this.setState({candidateQuestions, allSelected: true});
                    }
                  }}
                >
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
          <Divider />
          <div >
            <Table
              bodyStyle={styles.centered}
              headerStyle={styles.centered}
              selectable={false}
            >
              <TableHeader displaySelectAll={false} style={styles.centered}>
                <TableRow style={{border: 'none'}}>
                  <TableHeaderColumn>
                    Selected Questions
                  </TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
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
          </div>
        </div>
        <RaisedButton
          label='save'
          primary={true}
          onTouchTap={() => {
            addQuestionToCandidate(this.selectedCandidate.id, this.state.candidateQuestions)
              .then(this.props.addCandidateQuestions(this.selectedCandidate.id, this.state.candidateQuestions))
          }}
          containerElement={<Link to='/management' />}
        />
      </div>
    );
  };
};

const styles = {
  container: {
    display: 'flex',
    height: '90vh',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: '80%',
    margin: '0 auto',
  },
  centered: {
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  }
}

export default connect(mapStateToProps, {addCandidateQuestions})(MakeInterviewList);
