import React from 'react';
import {connect} from 'react-redux';
import firebase from 'firebase';
import {setInitialPositions, addPosition,
  deletePosition} from '../../actions/positions.action';
import {setInitialQuestions, addQuestion, deleteQuestion, editQuestion} from '../../actions/questions.action';
import {addPositionFirebase, deletePositionFirebase,
  addQuestionFirebase, deleteQuestionFirebase, editCandidateFirebase} from '../firebaseAPI';
import {map} from 'lodash';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

function mapStateToProps(state) {
  return (
    {
      positions: state.positions,
      questions: state.questions
    }
  )
};

class CustomQuestions extends React.PureComponent {
  constructor(){
    super();
    this.state = {
      allPositions: {},
      newPositonName: '',
      selectedPosition: '-1',
      newQuestion: '',
      allQuestions: {},
      selectedQuestion: '-1'
    };
  };

  componentWillMount() {
    firebase.database().ref('positions').once('value').then(snapshot => {
      const positions = snapshot.val();
      if (positions){
        this.props.setInitialPositions(positions);
      }
    });
    firebase.database().ref('questions').once('value').then(snapshot => {
      const questions = snapshot.val();
      if(questions){
        this.props.setInitialQuestions(questions);
      }
    })
  };

  componentWillReceiveProps(props) {
    this.setState({
      allPositions: props.positions,
      allQuestions: props.questions
    });
  };

  addPosition = () => {
    const id = addPositionFirebase(this.state.newPositonName);
    firebase.database().ref('positions/' + id).on('value', snapshot => {
      this.props.addPosition(snapshot.val());
      this.setState({newPositonName: ""});
    });
  };

  deletePosition = () => {
    deletePositionFirebase(this.state.selectedPosition).then(() => {
      this.props.deletePosition(this.state.selectedPosition);
    });
  };

  addQuestion =() => {
    const id = addQuestionFirebase({
      positionId: this.state.selectedPosition,
      questionText: this.state.newQuestion});
    firebase.database().ref('questions/' + id).on('value', snapshot => {
      this.props.addQuestion(snapshot.val());
      this.setState({newQuestion: ""});
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
    const RenderPositions = map(this.state.allPositions, position => {
      return(
        <MenuItem
          key={position.id}
          value={position.id}
          primaryText={position.positionName}
        />
      );
    });
    const RenderQuestions = map(this.state.allQuestions, question => {
      if(question.positionId === this.state.selectedPosition || this.state.selectedPosition === '-1'){
        const isSelected = question.id === this.state.selectedQuestion ?
            {backgroundColor: "#224C75"} : {backgroundColor: "rgb(216, 226, 242)"};
        return(
          <Paper
            key={question.id}
            style={{...isSelected, cursor: 'pointer'}}
            onTouchTap={() => {
              this.state.selectedQuestion !== question.id ?
                this.setState({selectedQuestion: question.id}) :
                this.setState({selectedQuestion: '-1'})
              }
            }
          >
            {question.questionText}
          </Paper>
        );
      }
    });
    return(
      <div className="hrHomei">
      <div className="hrHomeCustom">
        <div className="hrPosition">
<div className="hrPositionAdd">
          <TextField
          name="newPosition"
          floatingLabelText="Add new position"
          onChange={(e) => this.setState({newPositonName: e.target.value})}
          value={this.state.newPositonName}
        />
        <FlatButton
          primary
          label="Save"
          onTouchTap={() => this.addPosition()}
        />
        <FlatButton
          primary
          label="Delete"
          onTouchTap={() => this.deletePosition()}
        />
  </div>
        <DropDownMenu
        className="hrPositionDropdown"
          value={this.state.selectedPosition}
          onChange={(e, i, selectedPosition) => this.setState({selectedPosition})}
        >
          <MenuItem value='-1' primaryText='All questions' />
          {RenderPositions}
        </DropDownMenu>
      </div>
        <div className="hrQuestion">

        <FlatButton
          label="add question"
          disabled={this.state.selectedPosition === '-1'}
          primary
          onTouchTap={() => this.addQuestion()}
        />
        <FlatButton
          label="delete question"
          disabled={this.state.selectedQuestion === '-1'}
          primary
          onTouchTap={() => this.deleteQuestion()}
        />

        <FlatButton
          label='edit question'
          disabled={this.state.selectedQuestion === '-1'}
          primary
          onTouchTap={() => this.setState({isEditScreenOpen: true})}
        />
        <TextField
          name="newQuestion"
          floatingLabelText="New Question"
          fullWidth
          value={this.state.newQuestion}
          onChange={(e) => this.setState({newQuestion: e.target.value})}
        />
        {RenderQuestions}

        {
          (() => {
            if(this.state.selectedQuestion !== '-1'){
              return(
                <QuestionEditScreen
                  open={this.state.isEditScreenOpen}
                  closeScreen={() => this.setState({isEditScreenOpen: false})}
                  changeSelectedPosition={(selectedPosition) => this.setState({selectedPosition})}
                  allPositions={this.state.allPositions}
                  selectedPosition={this.state.selectedPosition}
                  question={this.state.allQuestions[this.state.selectedQuestion]}
                  saveQuestion={(question) => this.editQuestion(question)}
                  addNewQuestion={(questionText) => this.addQuestion(questionText)}
                />
              );
            }
          })()
        }
        </div>
        </div>
      </div>
    )
  }
};

export default connect(mapStateToProps, {setInitialPositions, addPosition,
  deletePosition, setInitialQuestions, addQuestion, deleteQuestion, editQuestion})(CustomQuestions);
