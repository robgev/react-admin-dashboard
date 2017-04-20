import React from 'react';
import {connect} from 'react-redux';
import firebase from 'firebase';
import moment from 'moment';
import {map, forEach, sortBy} from 'lodash';
import LoadingScreen from '../ur/components/Loadingscreen';
import {addCandidateFirebase, editCandidateFirebase, deleteCandidateFirebase} from '../firebaseAPI';

import {addCandidate, deleteCandidate, setInitial} from '../../actions/candidate.action';

import {Table, TableBody, TableHeader, TableHeaderColumn,
         TableRow, TableRowColumn} from 'material-ui/Table';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';

import CandidateChangePopup from './CandidateChangePopup';
import CandidateInterviewHomepage from './CandidateInterviewHomepage';

function mapStateToProps(state) {
  return (
    {
      candidates: state.candidates,
    }
  )
}

class Candidates1 extends React.PureComponent {
  constructor() {
    super();
    this.state = {
      candidates: {},
      selected: '-1',
      filter: '',
      interview: false,
      editScreen: false,
      sortValue: ''
    };
  };

  componentDidMount() {
    firebase.database().ref('candidates').once('value').then(candidates => {
      candidates = candidates.val();
      if (candidates){
        this.props.setInitial(candidates);
      }
    });
  };

  componentWillReceiveProps(props) {
    this.setState({candidates: props.candidates});
  };

  saveCandidate = (candidate, isNew) => {
    if(isNew) {
      const id = addCandidateFirebase(candidate);
      firebase.database().ref('candidates/' + id).on('value', snapshot => {
        this.props.addCandidate({...(snapshot.val()), id: id});
      });
    } else {
      const changedId = editCandidateFirebase(candidate);
      firebase.database().ref('candidates/' + changedId).on('value', snapshot => {
        this.props.addCandidate({...(snapshot.val()), id: changedId});
      })
    }
  };

  deleteCandidate = (id) => {
    const removedId = deleteCandidateFirebase(id).then(() => {
      this.props.deleteCandidate(id);
    });
  };

  filterListElements = (candidates) => {
    const compareStatus = (a, b) => {
      if (b.status === "Accepted" && a.status !== "Accepted"
      || b.status === "Shortlisted" && a.status === "Rejected") {
        return 1;
      }
    };
    switch (this.state.sortValue) {
      case "Name":
        return sortBy(candidates, i => i.name);
      case "Profession":
        return sortBy(candidates, i => i.profession);
      case "Status":
        return candidates.sort(compareStatus);
      case "Date":
        return sortBy(candidates, i => i.date);
      case "Level":
        return sortBy(candidates, i => i.level);
      case "":
        return candidates;
    }
  };

  render() {
    const selectedCandidate = this.state.candidates[this.state.selected];
    const header =  ['Name', 'Profession', 'Level', 'Date', 'Status'];
    let filteredCandidates = [];
    forEach(this.state.candidates, (candidate, id) => {
      const fits = header.some(i => {
        return candidate[i.toLowerCase()].toString().toLowerCase().includes(this.state.filter)
      });
      if (fits) {
        filteredCandidates.push({...candidate, id: id});
      }
    });
    filteredCandidates = this.filterListElements(filteredCandidates);
    const RenderCandidates = filteredCandidates.map(candidate => {
      const isSelected = candidate.id === this.state.selected ?
          {backgroundColor: '#E0E0E0'} : {};
      return (
        <TableRow
          key={candidate.id}
          style={{...isSelected, cursor: 'pointer'}}
          onTouchTap={
            () => {
              candidate.id === this.state.selected ?
                this.setState({selected: '-1'}) :
                this.setState({selected: candidate.id});
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
            {moment(candidate.date).format('Do MMMM YYYY, h:mm a')}
          </TableRowColumn>
          <TableRowColumn>
            {candidate.status}
          </TableRowColumn>
        </TableRow>
      );
    });

    const CandidateTable = () => {
      return(
        <Table
          selectable={false}
        >
          <TableHeader
            style={{backgroundColor: '#00BCD4'}}
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
                      style={{color: 'white'}}
                      label={column}
                      onTouchTap={() => this.setState({sortValue: column})}
                    />
                  </TableHeaderColumn>
                ))
              }
            </TableRow>
          </TableHeader>
          <TableBody
            displayRowCheckbox={false}
          >
            {RenderCandidates}
          </TableBody>
        </Table>
      );
    };

    const CandidateChange = () => {
      return (
        <CandidateChangePopup
          closeDialogueBox={() => this.setState({editScreen: false})}
          saveChangedCandidate={this.saveCandidate}
          candidate={
            selectedCandidate
           || {
            name: "", profession: "", status: "", isNew: true, date: new Date()
          }}
          id={this.state.selected}
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
      );
    };

    return(
      <div>
        <TextField
          floatingLabelText='Filter'
          value={this.state.filter}
          onChange={(e) => this.setState({filter: e.target.value})}
        />
        <FlatButton
          primary
          style={{marginLeft: '20px'}}
          label='add'
          onTouchTap={() => {
              this.setState({selected: 'new', editScreen: true});
            }
          }
        />
        <FlatButton
          primary
          disabled={this.state.selected === '-1' || this.state.selected === 'new'}
          style={{marginLeft: '20px'}}
          label='Interview'
          onTouchTap={() => this.setState({interview: true})}
        />
        <FlatButton
          primary
          disabled={this.state.selected === "-1" || this.state.selected === "new"}
          style={{marginLeft: "20px"}}
          label="edit"
          onTouchTap={() => this.setState({editScreen: true})}
        />
        <FlatButton
          primary
          disabled={this.state.selected === "-1" || this.state.selected === "new"}
          style={{marginLeft: "20px"}}
          label="delete"
          onTouchTap={() => this.deleteCandidate(this.state.selected)}
        />
        <CandidateTable />
        {
          (() => {
            if (this.state.editScreen) {
              return <CandidateChange />
            }
          })()
        }
        {
          (() => {
            if (this.state.interview) {
              return <CandidateInterview />
            }
          })()
        }
      </div>
    );
  };
};

export default connect(mapStateToProps, {addCandidate, deleteCandidate, setInitial})(Candidates1);
