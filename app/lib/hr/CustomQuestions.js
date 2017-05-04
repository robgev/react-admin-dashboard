import React from 'react';
import {connect} from 'react-redux';
import {map} from 'lodash';

import firebase from 'firebase';

import {addQuestion, deleteQuestion, editQuestion} from '../../actions/questions.action';
import {addQuestionFirebase, deleteQuestionFirebase, editQuestionFirebase} from '../firebaseAPI';

import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import QuestionEditScreen from './QuestionEditScreen';

function mapStateToProps({positions, questions}) {
  return {positions, questions};
};

class CustomQuestions extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      selectedPosition: '-1',
      newQuestion: '',
      selectedQuestion: '-1',
      isEditScreenOpen: false
    };
  };

  addQuestion = (text) => {
    const id = addQuestionFirebase({
      positionId: this.state.selectedPosition,
      questionText: text
    });
    firebase.database().ref('questions/' + id).on('value', snapshot => {
      this.props.addQuestion(snapshot.val());
      this.setState({newQuestion: ''});
    });
  };

  editQuestion = (question) => {
    const id = editQuestionFirebase(question);
    firebase.database().ref('questions/' + id).on('value', snapshot => {
      this.props.editQuestion(snapshot.val());
    });
  };

  deleteQuestion = () => {
    deleteQuestionFirebase(this.state.selectedQuestion).then(() => {
      this.props.deleteQuestion(this.state.selectedQuestion);
      this.setState({selectedQuestion: '-1'});
    });
  };

  render() {
    const RenderPositions = map(this.props.positions, position => {
      return(
        <MenuItem
          key={position.id}
          value={position.id}
          primaryText={position.positionName}
        />
      );
    });
    const RenderQuestions = map(this.props.questions, question => {
      if(question.positionId === this.state.selectedPosition || this.state.selectedPosition === '-1'){
        const isSelected = question.id === this.state.selectedQuestion ?
            {backgroundColor: '#E6E6E6'} : {};
        return(
          <div key={question.id}>
            <Paper
              className='hrPaperQuestions'
              style={isSelected}
              onTouchTap={() => {
                this.state.selectedQuestion !== question.id ?
                  this.setState({selectedQuestion: question.id}) :
                  this.setState({selectedQuestion: '-1'});
                }
              }
            >
              {question.questionText}
            </Paper>
            <Divider />
          </div>
        );
      }
    });
    return(
      <div className='hrHome'>
        <DropDownMenu
          className='hrPositionDropdown'
          value={this.state.selectedPosition}
          onChange={(e, i, selectedPosition) => this.setState({selectedPosition})}
        >
          <MenuItem value='-1' primaryText='All questions' />
          {RenderPositions}
        </DropDownMenu>
        <FlatButton
          label='add question'
          disabled={this.state.selectedPosition === '-1'}
          primary
          onTouchTap={() => this.setState({selectedQuestion: 'new', isEditScreenOpen: true})}
        />
        <FlatButton
          label='delete question'
          disabled={this.state.selectedQuestion === '-1'}
          primary
          onTouchTap={() => this.deleteQuestion()}
        />
        <FlatButton
          label='edit question'
          disabled={this.state.selectedQuestion === '-1'}
          primary
          onTouchTap={() => this.setState({
            isEditScreenOpen: true,
            selectedPosition: this.props.questions[this.state.selectedQuestion].positionId
          })}
        />
        {RenderQuestions}
        {
          this.state.selectedQuestion !== '-1' ?
          <QuestionEditScreen
            open={this.state.isEditScreenOpen}
            closeScreen={() => this.setState({isEditScreenOpen: false})}
            changeSelectedPosition={(selectedPosition) => this.setState({selectedPosition})}
            allPositions={this.props.positions}
            selectedPosition={this.state.selectedPosition}
            question={this.props.questions[this.state.selectedQuestion]}
            saveQuestion={(question) => this.editQuestion(question)}
            addNewQuestion={(questionText) => {
              this.addQuestion(questionText);
              this.setState({selectedQuestion: '-1'})
            }}
          /> : null
        }
      </div>
    )
  }
};

export default connect(mapStateToProps, {addQuestion, deleteQuestion, editQuestion})(CustomQuestions);
