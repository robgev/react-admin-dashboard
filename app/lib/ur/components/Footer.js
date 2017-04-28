import React from 'react';
import { Link } from 'react-router-dom';
import {Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle} from 'material-ui/Toolbar';

import colors from '../../colors';

const ui = {
  home:  {resource: '/',      link:'home',  iconName: 'home' },
  about: {resource: '/about', link:'about', iconName: 'help' }
}


export default () => {
  const links = [ui.home, ui.about];
  const listItems = links.map((currentItem, index) => {
    const needDivisor = index !== links.length - 1;
    const classname = needDivisor ? 'divisor' : '';
    return (
      <li key={currentItem.resource} style={footerListItemStyle}>
        <Link className={classname} style={linkStyle} to={currentItem.resource}>{currentItem.link}</Link>
      </li>
    );
  });

  return (
    <Toolbar style={footer}>
      <ToolbarGroup>
        <img src='/images/logo.svg' style={logoStyle} />
        <ul style={footerItemsContainer}>
          <li style={footerListItemStyle}>
            <a
              className={'divisor'}
              style={linkStyle}
              href='https://bitbucket.org/apollobytes/ab-internal'
              target='_blank'
            >{'Source Code'}</a>
          </li>
          {listItems}
        </ul>
      </ToolbarGroup>
      <ToolbarGroup>
        <div style={copyright} className={'push-right'}>
          <p style={copyrightStyle}>{'© 2017 ApolloBytes - All rights reserved'}</p>
        </div>
      </ToolbarGroup>
    </Toolbar>
  );
};

const dividerStyle = {
  backgroundColor: colors.grayLight
}

const copyright = {
  width: '100%',
  marginLeft: 'auto',
  textAlign: 'right',
}

const copyrightStyle = {
  textDecoration: 'none',
  color: '#E6E7E8',
  fontSize: '10px',
  textTransform: 'capitalize',
};

const linkStyle = {
  display: 'inline-block',
  textDecoration: 'none',
  color: '#E6E7E8',
  padding: '0 15px',
  fontSize: '10px',
  textTransform: 'capitalize',
};

const footerListItemStyle = {
  display: 'flex',
  alignItems: 'center',
};

const footerItemsContainer = {
  display: 'flex',
  listStyle: 'none',
  alignItems: 'center',
};

const logoStyle = {
  width: '65px',
  marginRight: '30px',
};

const footer = {
  display: 'flex',
  padding: '0 3%',
  width: '100%',
  backgroundColor: colors.primaryColor,
  color: 'white',
  height: '5vh',
  minHeight: '35px',
};
