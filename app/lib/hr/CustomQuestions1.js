import React from 'react';
import {connect} from 'react-redux';
import firebase from 'firebase';
import {setInitialPositions, addPosition, deletePosition} from '../../actions/positions.action';
import {addPositionFirebase, deletePositionFirebase} from '../firebaseAPI';
import {map} from 'lodash';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import Paper from 'material-ui/Paper';

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
      newPositonName: '',
      selectedPosition: '-1'
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

  addPosition = () => {
    const id = addPositionFirebase(this.state.newPositonName);
    firebase.database().ref('positions/' + id).on('value', snapshot => {
      this.props.addPosition(snapshot.val());
      this.setState({newPositonName: ""});
    });
  };

  deletePosition = () => {
    deletePositionFirebase(this.state.selectedPosition).then(() => {
      this.props.deletePosition(this.state.selectedPosition);
    });
  };

  render() {
    const RenderPositions = map(this.state.allPositions, position => {
      const isSelected = position.id === this.state.selectedPosition ?
          {backgroundColor: "#224C75"} : {};
      return(
        <Paper className="hrPaper"
          key={position.id}
          style=
          {{...isSelected,
             width:"300px" ,
             height: '50px',
             lineHeight: "50px",
             marginTop: '20px',
             backgroundColor: "rgb(216, 226, 242)",
             fontFamily: 'Roboto',
             fontSize: "20px",
             textAlign: "center",
             cursor: 'pointer'
          }}
          onTouchTap={() => this.setState({selectedPosition: position.id})}
        >
          {position.positionName}
        </Paper>
      );
    });
    return(
      <div>
        <TextField
          name="newPosition"
          floatingLabelText="Add new position"
          value={this.state.newPositonName}
          onChange={(e) => this.setState({newPositonName: e.target.value})}
        />
        <FlatButton
          label="Save"
          onTouchTap={() => this.addPosition()}
        />
        <FlatButton
          label="Delete"
          onTouchTap={() => this.deletePosition()}
        />
        {RenderPositions}
      </div>
    )
  }
};

export default connect(mapStateToProps, {setInitialPositions, addPosition, deletePosition})(CustomQuestions);
