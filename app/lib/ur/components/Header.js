import React from 'react';
import { Link } from 'react-router-dom';
import AppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

import colors from '../../colors';

const ui = [
  {resource: '/',      link:'home',  iconName: 'home'},
  {resource: '/management', link:'management', iconName: 'contacts'},
  {resource: '/room',  link:'room reservation', iconName: 'date_range'},
];

const adminResource = {resource: '/admin', link:'admin', iconName: 'vpn_key'};

export default ({ user, signOut, admin, id }) => {
  const { displayName, email, emailVerified, photoURL, uid, providerData } = user;
  const links = admin ? [...ui, adminResource] : [...ui];
  const listItems = links.map((currentItem, idx) => {
    const activeStyle = id===idx ?
        {backgroundColor: 'rgba(153, 153, 153, 0.2)'} : null
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
        <p>{`${displayName}`}</p>
        <img src={photoURL} className='user-pic' />
        <FlatButton
          style={{color: 'white'}}
          onClick={signOut}
          label="Sign Out"
        />
      </div>
    </AppBar>
  );
};

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
