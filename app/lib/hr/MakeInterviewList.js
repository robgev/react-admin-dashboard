import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {map, filter, find, findIndex} from 'lodash';
import {addQuestionToCandidate} from '../firebaseAPI';

import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';

import {addCandidateQuestions} from '../../actions/candidate.action';


function mapStateToProps({questions, candidates, selectedCandidate}) {
  return (
    {
      questions,
      candidates,
      selectedCandidate
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
      <div className='make-interview'>
        <div className='tables'>
          <div className='single-table'>
            <Paper
              style={{backgroundColor: '#52ABE1', padding: 10}}
              className='list-element'
            >
              <Checkbox
                labelStyle={{color: 'white'}}
                iconStyle={{fill: 'white'}}
                checked={this.state.allSelected}
                label='Questions'
                onCheck={() => {
                  if(this.state.candidateQuestions.length !== this.allQuestions.length){
                    let candidateQuestions = [];
                    this.allQuestions.map(question => {
                      candidateQuestions.push({questionId: question.id, answer: ''});
                    });
                    this.setState({candidateQuestions, allSelected: true});
                  } else {
                    this.setState({candidateQuestions: [], allSelected: false});
                  }
                }}
              />
            </Paper>
            {
              this.allQuestions.map(question => {
                const selected = !!find(this.state.candidateQuestions, {questionId: question.id});
                return(
                  <Paper
                    key={question.id}
                    className='list-element'
                    style={selected ? {backgroundColor: '#E0E0E0'} : null}
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
                    {question.questionText}
                  </Paper>
                );
              })
            }
          </div>
          <div className='single-table'>
            <Paper
              style={{backgroundColor: '#52ABE1', color: 'white'}}
              className='list-element'
            >
              Selected Questions
            </Paper>
            {
              selectedQuestions.map(question => {
                return(
                  <Paper
                    key={question.id}
                    className='list-element'
                    onTouchTap={() => {
                      let candidateQuestions = this.state.candidateQuestions.slice();
                      const index = findIndex(candidateQuestions, {questionId: question.id});
                      candidateQuestions.splice(index, 1);
                      this.setState({candidateQuestions});
                    }}
                  >
                    {question.questionText}
                  </Paper>
                );
              })
            }
          </div>
        </div>
        <RaisedButton
          style={margined}
          label='cancel'
          containerElement={<Link to='/management' />}
        />
        <RaisedButton
          style={margined}
          label='save'
          primary
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

const margined = {margin: 5};

const centered = {
  display: 'flex',
  justifyContent: 'center',
  textAlign: 'center',
};

export default connect(mapStateToProps, {addCandidateQuestions})(MakeInterviewList);
