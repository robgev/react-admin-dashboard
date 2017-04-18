import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
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
      name: candidate.name || "",
      profession: candidate.profession,
      status: candidate.status,
      isNew: candidate.isNew || false,
      date: candidate.date || new Date(),
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
    const professions = ["Developer", "Engineer", "Designer"];
    const statuses = ["Accepted", "Rejected", "Shortlisted"];
    const levels = ["Intern", "Junior", "Middle", "Senior"];
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
            professions.map((profession, index) =>
              <MenuItem
                key={index}
                value={profession}
                primaryText={profession}
              />
            )
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
      <FlatButton
        label="Cancel"
        primary={true}
        onTouchTap={closeDialogueBox}
      />,
      <FlatButton
        label="Save"
        primary={true}
        onTouchTap={
          () => {
            const changedCandidate = {
              id: candidate.id,
              name: this.state.name,
              profession: this.state.profession,
              status: this.state.status,
              date: this.state.date,
              level: this.state.level
            };
            saveChangedCandidate(changedCandidate, this.state.isNew);
            closeDialogueBox();
        }
      }
      />,
    ];

    return (
      <Dialog
        title="Change canidate info"
        actions={actions}
        modal={false}
        open={true}
        onRequestClose={closeDialogueBox}
      >
        <TextField
          name="name"
          fullWidth={true}
          floatingLabelText="Name"
          value={this.state.name}
          onChange={this.changeName}
        />
        <RenderProfessions />
        <RenderLevels />
        <RenderStatuses />
        <DatePicker
          hintText="Select Interview Date"
          mode="landscape"
          value={this.state.date}
          onChange={(e, newDate) => {
            const o = this.state.date;
            const n = newDate;
            const date = new Date(n.getFullYear(), n.getMonth(), n.getDate(), o.getHours(), o.getMinutes());
            this.setState({date})
          }}
        />
        <TimePicker
          hintText="Select Interview Time"
          value={this.state.date}
          onChange={(e, newTime) => {
            const o = this.state.date;
            const n = newTime;
            const date = new Date(o.getFullYear(), o.getMonth(), o.getDate(), n.getHours(), n.getMinutes());
            this.setState({date})
          }}
        />
      </Dialog>
    );
  }
}
