import React from 'react';
import HeaderButton from './HeaderButton';
import './Header.css';
import PropTypes from 'prop-types';
import Logo from '../Logo';
import Breadcrumbs from './Breadcrumbs';

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isNotificationsOpened: false
        };
    }

    logout() {
        this.props.onLogoutButtonClickHandler();
    }

    render() {
        return (
            <header className="header-desktop">
                <div className="logo-container">
                    <Logo size="small" />
                </div>
                <div className="main-header-container">
                    <Breadcrumbs items={this.props.breadCrumbs} onClick={this.props.navigateTo} />
                    <nav className="header-buttons">
                        <HeaderButton
                            label={this.props.logoutLabel}
                            icon="faSignOutAlt"
                            onClickHandler={() => this.logout()}
                        />
                    </nav>
                </div>
            </header>
        );
    }
}

Header.propTypes = {
    logoutLabel: PropTypes.string,
    notificationLabel: PropTypes.string,
    notifications: PropTypes.array,
    onLogoutButtonClickHandler: PropTypes.func,
    path: PropTypes.string,
    navigateTo: PropTypes.func
};

Header.defaultProps = {
    notifications: [],
    breadCrumbs: [],
    navigateTo: () => {},
    onLogoutButtonClickHandler: f => f
};

export default Header;
