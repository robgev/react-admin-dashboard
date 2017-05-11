import React from 'react';
import {map} from 'lodash';
import firebase from 'firebase';
import {connect} from 'react-redux';

import Paper from 'material-ui/Paper';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import {addPositionFirebase,
  editPositionFirebase, deletePositionFirebase} from '../firebaseAPI';
import {addPosition, deletePosition} from '../../actions/positions.action';

const mapStateToProps = ({positions}) => {
  return {positions}
};

class CustomPositions extends React.PureComponent{
  constructor(props){
    super(props);
    this.state = {
      positions: props.positions,
      selected: '-1',
      textValue: '',
      delete: false
    };
  };
  componentWillReceiveProps({positions}){
    this.setState({positions});
  };
  reset = () => {
    this.setState({selected: '-1', textValue: '', delete: false});
  };
  savePosition = () => {
    const {textValue: positionName, selected: id} = this.state;
    if(id === 'new') {
      const {key, promise} = addPositionFirebase(positionName);
      promise.then(this.props.addPosition({positionName, id: key}));
    } else {
    editPositionFirebase({positionName, id})
      .then(this.props.addPosition({positionName, id}));
    }
    this.reset();
  };
  deletePosition = () => {
    deletePositionFirebase(this.state.selected)
      .then(this.props.deletePosition(this.state.selected));
    this.reset();
  };
  render(){
    const Positions = map(this.state.positions, ({positionName, id}) => {
      const style = this.state.selected === id ? {backgroundColor: '#E6E6E6'} : null;
        return(
          <Paper
            key={id}
            style={style}
            className='hrPaperQuestions'
            onTouchTap={() => {
              this.state.selected !== id ?
              this.setState({selected: id, textValue: positionName}) :
              this.reset()
            }}
          >
            {positionName}
          </Paper>
        );
    });
    return (
      <div className='hrHome'>
        <div className='positions'>
          {Positions}
        </div>
        <div>
          <div>
            <RaisedButton
              style={margined}
              label='new'
              primary
              onTouchTap={() => this.setState({textValue: '', selected: 'new'})}
            />
            <RaisedButton
              style={margined}
              label='delete'
              primary
              disabled={this.state.selected === '-1'}
              onTouchTap={() => this.setState({delete: true})}
            />
          </div>
        {this.state.selected !== '-1' ?
          <div>
            <TextField
              name='edit'
              floatingLabelText='Position name'
              value={this.state.textValue}
              onChange={(e) => this.setState({textValue: e.target.value})}
            />
            <FlatButton
              style={margined}
              label='save'
              onTouchTap={() => this.savePosition()}
            />
          </div> :
          null
        }
        </div>
        {this.state.delete ?
          <Dialog
            open
            title='Confirm Position Delete'
            actions={[
              <RaisedButton
                style={margined}
                label='cancel'
                onTouchTap={() => this.setState({delete: false})}
              />,
              <RaisedButton
                style={margined}
                secondary
                label='confirm'
                onTouchTap={() => this.deletePosition()}
              />
            ]}
            onRequestClose={() => this.setState({delete: false})}
          >
            You are about to delete the position {this.props.positions[this.state.selected].positionName}, are you sure?
          </Dialog>
        : null}
      </div>
    );
  };
};

const margined = {margin: 5};

export default connect(mapStateToProps, {addPosition, deletePosition})(CustomPositions);
