import React from 'react';
import {connect} from 'react-redux';
import firebase from 'firebase';
import {setInitialPositions, addPosition,
  deletePosition} from '../../actions/positions.action';
import {setInitialQuestions, addQuestion, deleteQuestion} from '../../actions/questions.action';
import {addPositionFirebase, deletePositionFirebase,
  addQuestionFirebase, deleteQuestionFirebase} from '../firebaseAPI';
import {map} from 'lodash';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

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

  deleteQuestion = () => {
    deleteQuestionFirebase(this.state.selectedQuestion).then(() => {
      this.props.deleteQuestion(this.state.selectedQuestion);
    });
  };

  render() {
    const RenderPositions = map(this.state.allPositions, position => {
      const isSelected = position.id === this.state.selectedPosition ?
          {backgroundColor: "#224C75"} : {backgroundColor: "rgb(216, 226, 242)"};
      return(
        <Paper className="hrPaper"
          key={position.id}
          style=
          {{...isSelected,
             width:"300px" ,
             height: '50px',
             lineHeight: "50px",
             marginTop: '20px',
             fontFamily: 'Roboto',
             fontSize: "20px",
             textAlign: "center",
             cursor: 'pointer'
          }}
          onTouchTap={() => this.setState({selectedPosition: position.id})}
        >
          {position.positionName}
        </Paper>
      );
    });
    const RenderQuestions = map(this.state.allQuestions, question => {
      return(
        <Paper
          key={question.id}
          style={{cursor: 'pointer'}}
          onTouchTap={() => this.setState({selectedQuestion: question.id})}
        >
          {question.questionText}
        </Paper>
      );
    });
    return(
      <div className="hrHome">
        <TextField
          name="newPosition"
          floatingLabelText="Add new position"
          value={this.state.newPositonName}
          onChange={(e) => this.setState({newPositonName: e.target.value})}
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
        {RenderPositions}
        <TextField
          name="newQuestion"
          floatingLabelText="New Question"
          fullWidth
          value={this.state.newQuestion}
          onChange={(e) => this.setState({newQuestion: e.target.value})}
        />
        <FlatButton
          label="add question"
          primary
          onTouchTap={() => this.addQuestion()}
        />
        <FlatButton
          label="delete question"
          primary
          onTouchTap={() => this.deleteQuestion()}
        />
        {RenderQuestions}
      </div>
    )
  }
};

export default connect(mapStateToProps, {setInitialPositions, addPosition,
  deletePosition, setInitialQuestions, addQuestion, deleteQuestion})(CustomQuestions);
