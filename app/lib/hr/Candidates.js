import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash/core';
import uuid from 'uuid/v4';
import moment from 'moment';

import { Table, TableBody, TableHeader, TableHeaderColumn,
         TableRow, TableRowColumn } from 'material-ui/Table';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Dialog from 'material-ui/Dialog';

import CandidateChangePopup from './CandidateChangePopup';
import CandidateInterviewHomepage from './CandidateInterviewHomepage';

import {candidateChange, addCandidate, deleteCandidate} from '../../actions/candidate.action';

function mapStateToProps(state) {
  return (
    {
      candidates: state.candidates,
      questions: state.questions
    }
  )
}

class Candidates extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      candidates: this.props.candidates,
      dialogueBoxId: "-1",
      isDialogueBoxActive: false,
      filterValue: "",
      interviewScreen: false
    }
  }

  componentWillReceiveProps(props) {
    this.setState({candidates: props.candidates});
  }

  showCandidateDialogue = (dialogueBoxId) =>  {
    this.setState({dialogueBoxId});
  }

  closeDialogueBox = () => {
    this.setState({isDialogueBoxActive: false});
  }

  closeInterviewScreen = () => {
    this.setState({interviewScreen: false});
  }

  saveInterview = () => {
    console.log("saved")
  }

  saveChangedCandidate = (candidate, isNew) => {
    if(isNew) {
      this.props.addCandidate(candidate)
    } else {
      this.props.candidateChange(candidate);
    }
  }

  filterListElements = (value) => {
    let candidates =  this.state.candidates.slice();
    const compareStatus = (a, b) => {
      if (b.status === "Accepted" && a.status !== "Accepted"
      || b.status === "Shortlisted" && a.status === "Rejected") {
        return 1;
      }
    };
    switch (value) {
      case "Name":
        candidates = _.sortBy(candidates, i => i.name);
        break;
      case "Profession":
        candidates = _.sortBy(candidates, i => i.profession);
        break;
      case "Status":
        candidates = candidates.sort(compareStatus);
        break;
      case "Date":
        candidates = _.sortBy(candidates, i => i.date);
        break;
      case "Level":
        candidates = _.sortBy(candidates, i => i.level);
        break;
      default:
        break;
    }
    this.setState({candidates});
  }

  render() {
    const {candidates,filterValue} = this.state;
    const header =  ["Name", "Profession", "Level", "Date", "Status"];
    const candidate =  _.find(this.state.candidates, {id: this.state.dialogueBoxId});
    const filterCandidates = candidates.filter((c) => {
      return header.some(i => {
        return c[i.toLowerCase()].toString().toLowerCase().includes(filterValue)
      })
    });

    const CandidatesTable = () => {
      return (
        <Table
          selectable={false}
        >
          <TableHeader
            style={{backgroundColor: "#00BCD4"}}
            displaySelectAll={false}
            adjustForCheckbox={false}
          >
            <TableRow>
              {
                header.map(column => (
                  <TableHeaderColumn
                    key={column}
                  >
                    <FlatButton
                      style={{color: "white"}}
                      label={column}
                      onTouchTap={() => this.filterListElements(column)}
                    />
                  </TableHeaderColumn>
                ))
              }
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {filterCandidates.map((candidate, index) => {
              const isSelected = candidate.id === this.state.dialogueBoxId ?
                {backgroundColor: "#E0E0E0"} : {};
              return(
                <TableRow
                  style={{...isSelected, cursor: "pointer"}}
                  key={candidate.id}
                  onTouchTap={
                    () => {
                      candidate.id === this.state.dialogueBoxId ?
                        this.setState({dialogueBoxId: "-1"}) :
                        this.setState({dialogueBoxId: candidate.id});
                    }
                  }
                >
                  <TableRowColumn>
                    {candidate.name}
                  </TableRowColumn>
                  <TableRowColumn>
                    {candidate.profession}
                  </TableRowColumn>
                  <TableRowColumn>
                    {candidate.level}
                  </TableRowColumn>
                  <TableRowColumn>
                    {moment(candidate.date).format("Do MMMM YYYY, h:mm a")}
                  </TableRowColumn>
                  <TableRowColumn>
                    {candidate.status}
                  </TableRowColumn>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      );
    };

    const CandidateChange = () => {
      return (
        <CandidateChangePopup
          closeDialogueBox={this.closeDialogueBox}
          saveChangedCandidate={this.saveChangedCandidate}
          candidate={
            candidate
           || {
            id: uuid(), name: "", profession: "", status: "", isNew: true
          }}
        />
      );
    };

    const CandidateInterview = () => {
      return (
        <CandidateInterviewHomepage
          closeInterviewScreen={this.closeInterviewScreen}
          candidate={candidate}
          saveInterview={this.saveInterview}
          questions={this.props.questions[candidate.profession][candidate.level]}
        />
      )
    };

    return(
      <div>
        <TextField
          floatingLabelText="Filter"
          value={this.state.filterValue}
          onChange={(e) => this.setState({filterValue: e.target.value.toLowerCase()})}
        />
        <FlatButton
          primary={true}
          style={{marginLeft: "20px"}}
          label="add"
          onTouchTap={() => {
              this.setState({dialogueBoxId: "new", isDialogueBoxActive: true});
            }
          }
        />
        <FlatButton
          primary={true}
          disabled={this.state.dialogueBoxId === "-1" || this.state.dialogueBoxId === "new"}
          style={{marginLeft: "20px"}}
          label="Interview"
          onTouchTap={() => this.setState({interviewScreen: true})}
        />
        <FlatButton
          primary={true}
          disabled={this.state.dialogueBoxId === "-1" || this.state.dialogueBoxId === "new"}
          style={{marginLeft: "20px"}}
          label="edit"
          onTouchTap={() => this.setState({isDialogueBoxActive: true})}
        />
        <FlatButton
          primary={true}
          disabled={this.state.dialogueBoxId === "-1" || this.state.dialogueBoxId === "new"}
          style={{marginLeft: "20px"}}
          label="delete"
          onTouchTap={() => this.props.deleteCandidate(this.state.dialogueBoxId)}
        />
        <CandidatesTable />
        {
          (() => {
            if (this.state.isDialogueBoxActive) {
              return <CandidateChange />
            }
          })()
        }
        {
          (() => {
            if (this.state.interviewScreen) {
              return <CandidateInterview />
            }
          })()
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, {candidateChange, addCandidate, deleteCandidate})(Candidates);
