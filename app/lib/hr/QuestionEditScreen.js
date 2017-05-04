import React from 'react';
import {map} from 'lodash';

import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export default
class QuestionEditScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    const question = props.question || {}
    this.state={
      questionText: question.questionText || ''
    };
  };
  render() {
    const actions = [
      <FlatButton
        primary
        label='cancel'
        onTouchTap={() => this.props.closeScreen()}
      />,
      <FlatButton
        primary
        label='save'
        disabled={this.props.selectedPosition === '-1'}
        onTouchTap={() => {
          if(!this.props.question) {
            this.props.addNewQuestion(this.state.questionText);
          } else {
            this.props.saveQuestion({
              id: this.props.question.id,
              positionId: this.props.selectedPosition,
              questionText: this.state.questionText
            });
          }
          this.props.closeScreen();
        }
      }
      />
    ];
    const RenderPositions = map(this.props.allPositions, position => {
      return(
        <MenuItem
          key={position.id}
          value={position.id}
          primaryText={position.positionName}
        />
      );
    });
    return(
      <Dialog
          title='Edit the question'
          open={this.props.open}
          actions={actions}
          onRequestClose={() => this.props.closeScreen()}
      >
        <DropDownMenu
          value={this.props.selectedPosition}
          onChange={(e, i, change) => this.props.changeSelectedPosition(change)}
        >
          {RenderPositions}
        </DropDownMenu>
        <TextField
          name='question'
          fullWidth
          floatingLabelText='Question'
          value={this.state.questionText}
          onChange={(e) => this.setState({questionText: e.target.value})}
        />
      </Dialog>
    );
  };
};
