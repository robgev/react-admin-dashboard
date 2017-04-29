import React from 'react';
import {map} from 'lodash';
import firebase from 'firebase';
import {connect} from 'react-redux';

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
      const style = this.state.selected === id ? {backgroundColor: 'red'} : null;
        return(
          <FlatButton
            key={id}
            style={style}
            onTouchTap={() => this.setState({selected: id, textValue: positionName})}
          >
            {positionName}
          </FlatButton>
        );
    });
    return (
      <div style={{display: 'flex', flexDirection: 'column'}}>
        {Positions}
        {this.state.selected !== '-1' ?
          <div>
            <TextField
              name='edit'
              floatingLabelText='Position name'
              value={this.state.textValue}
              onChange={(e) => this.setState({textValue: e.target.value})}
            />
            <FlatButton
              label='save'
              onTouchTap={() => this.savePosition()}
            />
          </div> :
          null
        }
        <div>
          <FlatButton
            label='new'
            primary
            onTouchTap={() => this.setState({textValue: '', selected: 'new'})}
          />
          <FlatButton
            label='delete'
            primary
            disabled={this.state.selected === '-1'}
            onTouchTap={() => this.setState({delete: true})}
          />
        </div>
        {this.state.delete ?
          <Dialog
            open
            title='Confirm Position Delete'
            actions={[
              <RaisedButton
                label='cancel'
                onTouchTap={() => this.setState({delete: false})}
              />,
              <RaisedButton
                primary
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

export default connect(mapStateToProps, {addPosition, deletePosition})(CustomPositions);
