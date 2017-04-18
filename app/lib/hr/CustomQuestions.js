import React from 'react';
import {findIndex} from 'lodash';
import {changeQuestion, addQuestion, removeQuestion, addProfession, removeProfession} from '../../actions/questions.action';
import {connect} from 'react-redux';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import Paper from 'material-ui/Paper';
import SelectedQuestionEdit from './SelectedQuestionEdit';

function mapStateToProps(state) {
  return (
    {
      questions: state.questions,
    }
  )
};

class CustomQuestions extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      selectedQuestionId: "-1",
      questions: this.props.questions,
      professions: Object.keys(this.props.questions),
      addProfession: "",
      profession: "Developer",
      level: "Intern",
      editable: ""
    }
  };

  componentWillReceiveProps(newProps) {
    this.setState({
      questions: newProps.questions,
      professions: Object.keys(newProps.questions)
    });
  };

  render() {
    const {selectedQuestionId, profession, level} = this.state;
    const levels = ["Intern", "Junior", "Middle", "Senior"];
    const questions = this.state.questions[this.state.profession][this.state.level];
    const index = findIndex(questions, {id: selectedQuestionId});

    const RenderProfessions = () => {
      return (
        <DropDownMenu
          value={this.state.profession}
          onChange={(e, i, profession) => this.setState({profession})}
        >
          {
            this.state.professions.map(p => <MenuItem key={p} value={p} primaryText={p} />)
          }
        </DropDownMenu>
      )
    };

    const RenderLevels = () => {
      return (
        <DropDownMenu
          value={this.state.level}
          onChange={(e, i, level) => this.setState({level})}
        >
          {
            levels.map(l => <MenuItem key={l} value={l} primaryText={l}/>)
          }
        </DropDownMenu>
      )
    };

    const RenderQuestionEdit = () => {
      const {selectedQuestionId, profession, level} = this.state;
      if (selectedQuestionId !== "-1"){
        const index = findIndex(this.state.questions[profession][level], {id: selectedQuestionId});
      }
      return (
        <div>
          Select a question to edit
        </div>
      )
    }

    return (
      <div style={{display: "flex"}}>
        <div style={{width: "50%"}}>
          <RenderProfessions />
          <RenderLevels />
          <br/>
          <TextField
            value={this.state.addProfession}
            floatingLabelText="Add a new profession"
            onChange={(e) => this.setState({addProfession: e.target.value})}
          />
          <FlatButton
            primary={true}
            label="Save"
            onTouchTap={() => {
              this.props.addProfession(this.state.addProfession);
              this.setState({addProfession: ""})
            }}
            style={{marginBottom: "20px"}}
          />
          {questions.map((question, index) => {
            return (
              <div key={question.id}>
                <Paper
                  onTouchTap={() => this.setState({selectedQuestionId: question.id})}
                  style={{
                    marginTop: "10px",
                    marginLeft: "10px",
                    width: "80%",
                    height: "30px",
                    cursor: "pointer"
                  }}
                >
                  {question.question}
                </Paper>
              </div>
              )
            })
          }
          <FlatButton
            style={{marginTop: "20px"}}
            primary={true}
            label="add question"
            onTouchTap={() => this.props.addQuestion(this.state.profession, this.state.level)}
          />
        </div>
        <div style={{width: "50%"}}>
          {
            (()=>{
              if (this.state.selectedQuestionId !== "-1") {
                return (
                  <SelectedQuestionEdit
                    value={questions[index].question}
                  />
                )
              }
            })()
          }
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, {removeQuestion, changeQuestion, addQuestion, addProfession, removeProfession})(CustomQuestions);
