import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {map, forEach, sortBy} from 'lodash';

import firebase from 'firebase';

import moment from 'moment';

import CandidateChangePopup from './CandidateChangePopup';

import {addCandidate, deleteCandidate} from '../../actions/candidate.action';
import {addCandidateFirebase, editCandidateFirebase, deleteCandidateFirebase} from '../firebaseAPI';

import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableHeaderColumn,
         TableRow, TableRowColumn} from 'material-ui/Table';


function mapStateToProps(state) {
  return (
    {
      candidates: state.candidates,
      positions: state.positions
    }
  )
}

class Candidates extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      candidates: props.candidates,
      selected: '-1',
      filter: '',
      interview: false,
      editScreen: false,
      sortValue: {
        value: '',
        up: false
      },
      delete: false
    };
  };

  componentWillReceiveProps({candidates}) {
    this.setState({candidates});
  };

  saveCandidate = (candidate, isNew) => {
    if(isNew) {
      const id = addCandidateFirebase(candidate);
      firebase.database().ref('candidates/' + id).on('value', snapshot => {
        this.props.addCandidate(snapshot.val());
      });
    } else {
      const changedId = editCandidateFirebase(candidate);
      firebase.database().ref('candidates/' + changedId).on('value', snapshot => {
        this.props.addCandidate(snapshot.val());
      })
    }
  };

  deleteCandidate = () => {
    const {selected} = this.state;
    deleteCandidateFirebase(selected).then(() => {
      this.props.deleteCandidate(selected);
      this.setState({selected: '-1'});
    });
  };

  filterListElements = (candidates) => {
    const compareStatus = (a, b) => {
      if (b.status === 'Accepted' && a.status !== 'Accepted'
      || b.status === 'Shortlisted' && a.status === 'Rejected') {
        return 1;
      }
    };
    switch (this.state.sortValue.value) {
      case 'Name':
        return sortBy(candidates, i => i.name);
      case 'Profession':
        return sortBy(candidates, i => i.profession);
      case 'Status':
        return candidates.sort(compareStatus);
      case 'Date':
        return sortBy(candidates, i => i.date);
      case 'Level':
        return sortBy(candidates, i => i.level);
      case '':
        return candidates;
    }
  };

  render() {
    const selectedCandidate = this.state.candidates[this.state.selected];
    const header =  ['Name', 'Profession', 'Level', 'Date', 'Status'];
    const isDisabled = this.state.selected === '-1' || this.state.selected === 'new';
    let filteredCandidates = [];
    forEach(this.state.candidates, candidate => {
      const fits = header.some(i => {
        return candidate[i.toLowerCase()].toString().toLowerCase().includes(this.state.filter)
      });
      if (fits || this.props.positions[candidate.profession].positionName.toLowerCase().includes(this.state.filter)) {
        filteredCandidates.push(candidate);
      }
    });
    filteredCandidates = this.filterListElements(filteredCandidates);
    this.state.sortValue.up ? filteredCandidates.reverse() : null;
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
            {this.props.positions[candidate.profession].positionName}
          </TableRowColumn>
          <TableRowColumn>
            {candidate.level}
          </TableRowColumn>
          <TableRowColumn>
            {moment(new Date(candidate.date)).format('Do MMMM YYYY, h:mm a')}
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
                    className='tableRows'
                  >
                    <FlatButton
                      style={{color: 'white'}}
                      label={column}
                      onTouchTap={() => {
                        const sortValue = {
                          ...this.state.sortValue,
                          value: column
                        };
                        this.setState({sortValue});
                      }
                    }
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
          positions={this.props.positions}
          closeDialogueBox={() => this.setState({editScreen: false})}
          saveChangedCandidate={this.saveCandidate}
          candidate={
            selectedCandidate
           || {
            name: '', profession: '', status: '', isNew: true, date: new Date()
          }}
          id={this.state.selected}
        />
      );
    };

    return(
      <div className='hrHome'>
      <div className='hrForButtonsandFilter'>
        <TextField
          floatingLabelText='Filter'
          value={this.state.filter}
          onChange={(e) => this.setState({filter: e.target.value})}
        />
        <div className='hrCandidatesButtons'>
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
          label='edit'
          onTouchTap={() => this.setState({editScreen: true})}
        />
        <FlatButton
          primary
          disabled={this.state.selected === '-1' || this.state.selected === 'new'}
          style={{marginLeft: '20px'}}
          label='delete'
          onTouchTap={() => this.setState({delete: true})}
        />
        <FlatButton
          primary
          disabled={isDisabled}
          style={{marginLeft: '20px'}}
          label='questionlist'
          containerElement={
            isDisabled ?
            <div></div> :
            <Link to={'/management/interview/' + this.state.selected} />
          }
        />
        <FlatButton
          primary
          disabled={isDisabled}
          style={{marginLeft: '20px'}}
          label='interview'
          containerElement={
            isDisabled ?
            <div></div> :
            <Link to={'/management/candidateInterview/' + this.state.selected} />
          }
        />
        </div>
        </div>
        <CandidateTable />
        {this.state.editScreen ? <CandidateChange /> : null}
        {this.state.delete ?
          <Dialog
            open
            title='Confirm Candidate Delete'
            actions={[
              <RaisedButton
                label='cancel'
                onTouchTap={() => this.setState({delete: false})}
              />,
              <RaisedButton
                label='confirm'
                className='deleteButton'
                onTouchTap={() => {this.deleteCandidate(), this.setState({delete: false})}}
              />
            ]}
            onRequestClose={() => this.setState({delete: false})}
          >
            You are about to delete the candidate {selectedCandidate.name}, are you sure?
          </Dialog>
        : null}
      </div>
    );
  };
};

export default connect(mapStateToProps, {addCandidate, deleteCandidate})(Candidates);
