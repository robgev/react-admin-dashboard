import React from 'react';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import RaisedButton from 'material-ui/RaisedButton';

export default
class ErrorPopup extends React.Component {
  render(){
    return(
      <ModalContainer>
        <ModalDialog>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column'
          }}>
            <h1 style={{color: '#F44336'}}>
              {this.props.msg}
            </h1>
            <br />
            <RaisedButton
              label="Close"
              primary={false}
              onClick={ this.props.close }
            />
          </div>
        </ModalDialog>
      </ModalContainer>
    )
  }
}
