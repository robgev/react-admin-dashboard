import React from 'react';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {orange500, blue500} from 'material-ui/styles/colors';
import injectTapEventPlugin from 'react-tap-event-plugin';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class NewCandidateForm extends React.PureComponent {
    constructor(props){
      super(props);
      injectTapEventPlugin();
      this.state = {
        value: ""
      };
    }

      handleSumbit = (e) => {
        alert('New Candidate: ' + this.state.value);
        event.preventDefault();
      }

      handleChange = (e) => {
        this.setState({value: e.target.value});
      }

  render() {

    const styles = {
      floatingLabelStyle: {
        color: orange500,
      },
      floatingLabelFocusStyle: {
        color: blue500,
      },
    };


      const TextFieldName = () => (
      <div>
          <TextField
          floatingLabelText="Full Name"
          floatingLabelStyle={styles.floatingLabelStyle}
          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
        />
      </div>
      );

      const TextFieldEmail = () => (
      <div>
          <TextField
          floatingLabelText="Email Address"
          floatingLabelStyle={styles.floatingLabelStyle}
          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
        />
      </div>
      );

      const TextFieldPhone = () => (
      <div>
          <TextField
          floatingLabelText="Phone"
          floatingLabelStyle={styles.floatingLabelStyle}
          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
        />
      </div>
      );

      const TextFieldAddress = () => (
      <div>
          <TextField
          floatingLabelText="Address"
          floatingLabelStyle={styles.floatingLabelStyle}
          floatingLabelFocusStyle={styles.floatingLabelFocusStyle}
        />
      </div>
      );

      const DatePickerMine = () => (
        <div>
          <DatePicker hintText="Birthday Date" mode="landscape" />
        </div>
      );


    const RaisedButtonExampleSimple = () => (
      <div>
        <RaisedButton
        label="Submit"
        primary={true}
        prop={true}
        />
      </div>
    );

    const SelectPosition = () => (
      <div>
        <SelectField
            floatingLabelText="Position"
            value={1}
        >
        <MenuItem primaryText="Developer" value={1}/>
        <MenuItem primaryText="Designer" />
        <MenuItem primaryText="Engineer" />
        </SelectField>
      </div>
    )

    return(
      <div>
      <form>
          <TextFieldName  />
          <SelectPosition />
          <DatePickerMine />
          <TextFieldEmail />
          <TextFieldPhone />
          <TextFieldAddress />
          <RaisedButtonExampleSimple />
      </form>
      </div>
    )
  }
}

export default NewCandidateForm;
