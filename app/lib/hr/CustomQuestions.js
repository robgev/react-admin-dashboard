import React from 'react';
import {connect} from 'react-redux';
import {map} from 'lodash';

import firebase from 'firebase';

import {addQuestion, deleteQuestion, editQuestion} from '../../actions/questions.action';
import {addQuestionFirebase, deleteQuestionFirebase, editQuestionFirebase} from '../firebaseAPI';

import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';
import MenuItem from 'material-ui/MenuItem';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import RaisedButton from 'material-ui/RaisedButton';
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
      isEditScreenOpen: false,
      delete: false
    };
  };

  addQuestion = (questionText) => {
    const {selectedPosition: positionId} = this.state;
    const {promise, key} = addQuestionFirebase({positionId, questionText});
    promise.then(() => {
      this.props.addQuestion({id: key, positionId, questionText});
      this.setState({newQuestion: ''});
    });
  };

  editQuestion = (question) => {
    editQuestionFirebase(question).then(() => {
      this.props.editQuestion(question);
    });
  };

  deleteQuestion = () => {
    const {selectedQuestion} = this.state;
    this.setState({selectedQuestion: '-1', delete: false});
    deleteQuestionFirebase(selectedQuestion).then(() => {
      this.props.deleteQuestion(selectedQuestion);
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
            {backgroundColor: '#E6E6E6'} : null;
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
      <div className='hrHome candidates'>
        <DropDownMenu
          className='hrPositionDropdown'
          value={this.state.selectedPosition}
          onChange={(e, i, selectedPosition) => this.setState({selectedPosition})}
        >
          <MenuItem value='-1' primaryText='All questions' />
          {RenderPositions}
        </DropDownMenu>
        <FlatButton
          style={margined}
          label='add question'
          disabled={this.state.selectedPosition === '-1'}
          primary
          onTouchTap={() => this.setState({selectedQuestion: 'new', isEditScreenOpen: true})}
        />
        <FlatButton
          style={margined}
          label='delete question'
          disabled={this.state.selectedQuestion === '-1'}
          primary
          onTouchTap={() => this.setState({delete: true})}
        />
        <FlatButton
          style={margined}
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
        {this.state.delete ?
          <Dialog
            open
            title='Confirm Question Delete'
            actions={[
              <RaisedButton
                style={margined}
                label='cancel'
                onTouchTap={() => this.setState({delete: false})}
              />,
              <RaisedButton
                style={margined}
                secondary
                label='confirm'
                onTouchTap={() => this.deleteQuestion()}
              />
            ]}
            onRequestClose={() => this.setState({delete: false})}
          >
            You are about to delete the question {this.props.questions[this.state.selectedQuestion].questionText}, are you sure?
          </Dialog>
        : null}
      </div>
    )
  }
};

const margined = {margin: 5};

export default connect(mapStateToProps, {addQuestion, deleteQuestion, editQuestion})(CustomQuestions);
