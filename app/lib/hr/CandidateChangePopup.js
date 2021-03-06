import React from 'react';
import {map} from 'lodash';

import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import DatePicker from 'material-ui/DatePicker';
import TimePicker from 'material-ui/TimePicker';

export default class CandidateChangePopup extends React.PureComponent {
  constructor(props) {
    super(props);
    const {candidate} = props;
    this.state = {
      name: candidate.name,
      profession: candidate.profession,
      status: candidate.status,
      isNew: candidate.isNew || false,
      date: null,
      level: candidate.level
    }
  }

  changeProfession = (e, i, profession) => {
    this.setState({profession});
  }

  changeStatus = (e, i, status) => {
    this.setState({status});
  }

  changeName = (e) => {
    this.setState({name: e.target.value})
  }

  render() {
    const {positions} = this.props;
    const statuses = ['Accepted', 'Rejected', 'Shortlisted'];
    const levels = ['Intern', 'Junior', 'Middle', 'Senior'];
    const {closeDialogueBox, saveChangedCandidate, candidate} = this.props;
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
    const RenderProfessions = () => {
      return (
        <DropDownMenu
          value={this.state.profession}
          onChange={this.changeProfession}
        >
          {
            map(positions, position => {
              return(
                <MenuItem
                  key={position.id}
                  value={position.id}
                  primaryText={position.positionName}
                />
              )
            })
          }
        </DropDownMenu>
      )
    };
    const RenderStatuses = () => {
      return (
        <DropDownMenu
          value={this.state.status}
          onChange={this.changeStatus}
        >
          {
            statuses.map((status, index) =>
              <MenuItem
                key={index}
                value={status}
                primaryText={status}
              />
            )
          }
        </DropDownMenu>
      )
    }
    const actions = [
      <RaisedButton
        style={margined}
        label='Cancel'
        onTouchTap={closeDialogueBox}
      />,
      <RaisedButton
        style={margined}
        label='Save'
        primary
        onTouchTap={
          () => {
            const currentDate = this.state.date || new Date(candidate.date);
            const id = this.props.id === '-1' ? false : this.props.id;
            const changedCandidate = {
              name: this.state.name,
              profession: this.state.profession,
              status: this.state.status,
              date: currentDate.toString(),
              level: this.state.level,
              id: id
            };
            saveChangedCandidate(changedCandidate, this.state.isNew);
            closeDialogueBox();
        }
      }
      />,
    ];

    return (
      <Dialog
        title='Change canidate info'
        contentStyle={{width: 500}}
        actions={actions}
        modal={false}
        open
        onRequestClose={closeDialogueBox}
      >
        <div style={{display: 'flex', flexDirection: 'column'}}>
          <TextField
            name='name'
            floatingLabelText='Name'
            value={this.state.name}
            onChange={this.changeName}
          />
          <RenderProfessions />
          <RenderLevels />
          <RenderStatuses />
          <DatePicker
            hideCalendarDate={true}
            hintText='Select Interview Date'
            mode='landscape'
            value={this.state.date}
            onChange={(e, newDate) => {
              const o = this.state.date || new Date(candidate.date);
              const n = newDate;
              const date = new Date(n.getFullYear(), n.getMonth(), n.getDate(), o.getHours(), o.getMinutes());
              this.setState({date})
            }}
          />
          <TimePicker
            hintText='Select Interview Time'
            value={this.state.date}
            onChange={(e, newTime) => {
              const o = this.state.date;
              const n = newTime;
              const date = new Date(o.getFullYear(), o.getMonth(), o.getDate(), n.getHours(), n.getMinutes());
              this.setState({date})
            }}
          />
        </div>
      </Dialog>
    );
  }
}

const margined = {margin: 5};
