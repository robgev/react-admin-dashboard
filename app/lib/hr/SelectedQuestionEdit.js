import React from 'react';
import TextField from 'material-ui/TextField';

export default
class SelectedQuestionEdit extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = {
      value: this.props.value,
    }
  }
  render() {
    return (
      <div>
        <TextField
          name='editable'
          value={this.state.value}
          onChange={(e) => this.setState({value: e.target.value})}
        />
      </div>
    )
  }
}
