import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {map, forEach, sortBy} from 'lodash';

import firebase from 'firebase';

import moment from 'moment';

import CandidateChangePopup from './CandidateChangePopup';

import {addCandidate, deleteCandidate} from '../../actions/candidate.action';
import {addCandidateFirebase, editCandidateFirebase, deleteCandidateFirebase} from '../firebaseAPI';

import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {Table, TableBody, TableHeader, TableHeaderColumn,
         TableRow, TableRowColumn} from 'material-ui/Table';


function mapStateToProps({candidates, positions}) {
  return {candidates, positions};
};

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
        value: 'Name',
        up: false
      },
      delete: false
    };
  };

  componentWillReceiveProps({candidates}) {
    this.setState({candidates});
  };

  componentDidMount() {
    this.filterListElements(this.state.candidates);
  };

  saveCandidate = (candidate, isNew) => {
    if(isNew) {
      const {promise, key} =  addCandidateFirebase(candidate);
      promise.then(() => {
        this.props.addCandidate({...candidate, id: key});
      });
    } else {
      editCandidateFirebase(candidate).then(() => {
        this.props.addCandidate(candidate);
      });
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
          {backgroundColor: '#E0E0E0'} : null;
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
                  >
                    <div
                      style={{color: 'white', cursor: 'pointer', fontSize: 20, display: 'flex'}}
                      onClick={() => {
                        const sortValue = {
                          value: column,
                          up: this.state.sortValue.value === column ? !this.state.sortValue.up : this.state.sortValue.up
                        };
                        this.setState({sortValue});
                      }}
                    >
                      {column}
                      {this.state.sortValue.value === column ?
                        <i className='material-icons'>
                          {this.state.sortValue.up ? 'arrow_upward' : 'arrow_downward'}
                        </i> :
                        null
                      }
                    </div>
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
      <div className='hrHome candidates'>
        <div>
          <TextField
            style={{marginLeft: 20}}
            floatingLabelText='Filter'
            value={this.state.filter}
            onChange={(e) => this.setState({filter: e.target.value})}
          />
          <div style={{marginBottom: 5}}>
            <RaisedButton
              primary
              style={{marginLeft: 20}}
              label='add'
              onTouchTap={() => {
                  this.setState({selected: 'new', editScreen: true});
                }
              }
            />
            <RaisedButton
              primary
              disabled={this.state.selected === '-1' || this.state.selected === 'new'}
              style={margined}
              label='edit'
              onTouchTap={() => this.setState({editScreen: true})}
            />
            <RaisedButton
              primary
              disabled={this.state.selected === '-1' || this.state.selected === 'new'}
              style={margined}
              label='delete'
              onTouchTap={() => this.setState({delete: true})}
            />
            <RaisedButton
              primary
              disabled={isDisabled}
              style={margined}
              label='questionlist'
              containerElement={
                isDisabled ?
                <div></div> :
                <Link to={'/management/interview/' + this.state.selected} />
              }
            />
            <RaisedButton
              primary
              disabled={isDisabled}
              style={margined}
              label='interview'
              containerElement={
                isDisabled ?
                <div></div> :
                <Link to={'/management/candidateInterview/' + this.state.selected} />
              }
            />
          </div>
        </div>
        <div style={{margin: 20}}>
          <CandidateTable />
        </div>
        {this.state.editScreen ? <CandidateChange /> : null}
        {this.state.delete ?
          <Dialog
            open
            title='Confirm Candidate Delete'
            actions={[
              <RaisedButton
                style={margined}
                label='cancel'
                onTouchTap={() => this.setState({delete: false})}
              />,
              <RaisedButton
                style={margined}
                label='confirm'
                secondary
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

const margined = {marginLeft: 5};

export default connect(mapStateToProps, {addCandidate, deleteCandidate})(Candidates);
