import React from 'react';

const headerData = [ 'Overview', 'Dashboard', 'Time sheets' ]

class Header extends React.Component {
  render(){
    return (
      <ul className='H_container'>
        {headerData.map((menuItem) => {          
          return (
            <li
              style={menuItem === this.props.appState.selectedMenu ? { color: 'var(--color-header-active)' } : null}
              onClick={this.props.changeMenuTab.bind(null,menuItem)}
              key={menuItem}
            >
              {menuItem}
            </li>
          )
        })}
      </ul>
    )
  }
}

module.exports = Header;