import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';


import colors from '../../colors';

const ui = [
  {resource: '/management', link:'management', iconName: 'contacts'},
  {resource: '/room',  link:'room reservation', iconName: 'date_range'},
];

const adminResource = {resource: '/admin', link:'admin', iconName: 'vpn_key'};

export default ({ user, signOut, admin, id }) => {
  const { displayName, email, emailVerified, photoURL, uid, providerData } = user;
  const links = admin ? [...ui, adminResource] : [...ui];
  const listItems = links.map((currentItem, idx) => {
    const activeStyle = id===idx ?
        {borderBottom: `2px solid ${colors.red}`} : null
    return (
      <li key={currentItem.resource} style={{...listItemStyle, ...activeStyle}}>
        <Link style={linkStyle} to={currentItem.resource}>
          <i className={'material-icons'}>{currentItem.iconName}</i>
          {currentItem.link}
        </Link>
      </li>
    );
  });

  return (
    <AppBar
      title={<Link to='/user'><img src='/images/logo.svg' style={logoStyle} /></Link>}
      showMenuIconButton={false}
      titleStyle={titleStyle}
      style={appBarStyle}
    >
      <ul style={topMenuListStyle}>
        {listItems}
      </ul>
      <div className='user-info'>
        {
          admin ? <p style={adminInfo}>Admin View</p> : null
        }
        <IconMenu
          iconButtonElement={
            <div style={dropdownContainerStyle}>
              <p>{`${displayName}`}</p>
              <img src={photoURL} className='user-pic' />
            </div>
          }
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
        >
          <Link to='/user' >
            <MenuItem primaryText="Profile" />
          </Link>
          <MenuItem  onTouchTap={signOut} primaryText="Sign out" />
        </IconMenu>
      </div>
    </AppBar>
  );
};

const dropdownContainerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px',
  cursor: 'pointer',
}

const appBarStyle = {
  alignItems: 'center',
  height: '5vh',
  width: '100%',
  backgroundColor: colors.primaryColor,
  color: 'white',
  minHeight: '35px',
}

const titleStyle = {
  flex: 'initial'
}

const dividerStyle = {
  backgroundColor: colors.grayLight
}

const userName = {
  paddingLeft: '5px',
}

const linkStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  textTransform: 'capitalize',
}

const adminInfo = {
  marginLeft: 'auto',
  marginRight: 'auto',
}

const listItemStyle = {
  display: 'flex',
  alignItems: 'center',
  padding: '0 15px',
  marginBottom: '-2px',
  borderBottom: '2px solid transparent',
};

const topMenuListStyle = {
  display: 'flex',
  alignItems: 'center',
  listStyle: 'none',
};

const logoStyle = {
  width: '65px',
  marginRight: '30px',
};
