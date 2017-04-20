import React from 'react';
import {connect} from 'react-redux';
import firebase from 'firebase';
import {setInitialPositions, addPosition, deletePosition} from '../../actions/positions.action';
import {addPositionFirebase, deletePositionFirebase} from '../firebaseAPI';
import {map} from 'lodash';
import TextField from 'material-ui/TextField';

function mapStateToProps(state) {
  return (
    {
      positions: state.positions
    }
  )
};

class CustomQuestions extends React.PureComponent {
  constructor(){
    super();
    this.state = {
      allPositions: {},
      newPositonName: ''
    };
  };
  componentDidMount() {
    firebase.database().ref('positions').once('value').then(snapshot => {
      const positions = snapshot.val();
      if (positions){
        this.props.setInitialPositions(positions);
      }
    });
  };

  componentWillReceiveProps(props) {
    this.setState({allPositions: props.positions});
  };

  addPosition = (positionName) => {
    const id = addPositionFirebase(positionName);
    firebase.database().ref('positions/' + id).on('value', snapshot => {
      this.props.addPosition(snapshot.val());
    });
  };

  deletePosition = (id) => {
    deletePositionFirebase(id).then(() => {
      this.props.deletePosition(id);
    });
  };

  render() {
    const RenderPositions = map(this.state.allPositions, position => {
      return(
        <div key={position.id}>
          {position.positionName}
        </div>
      );
    });
    return(
      <div>
        <TextField
          name="newPosition"
          value={this.state.newPositonName}
          onChange={(e) => this.setState({newPositonName: e.target.value})}
        />
        {RenderPositions}
      </div>
    )
  }
};

export default connect(mapStateToProps, {setInitialPositions, addPosition, deletePosition})(CustomQuestions);
