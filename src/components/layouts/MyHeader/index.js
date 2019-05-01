/* [헤더 컴포넌트]
 * - Material-UI의 AppBar 활용 중심
 * - 우측 상단에 로그인/아웃 기능이 있음
 */
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Route } from 'react-router-dom';
// Material-UI Compos
import withStyles from '@material-ui/core/styles/withStyles';
// import { Typography, AppBar, Toolbar, IconButton, Button } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
// MyCompo
import MyHeaderTitle from './Title'

/* props 설정 */
const propTypes = {
    isAuth: PropTypes.bool , // 인증 여부
    isOpen: PropTypes.bool , // 메뉴 오픈 여부
    onSign: PropTypes.func , // 로그인/아웃 메소드
    onMenuOpen: PropTypes.func , // 메뉴 오픈 메소드
    classes: PropTypes.object.isRequired
};
const propsError = msg => { console.log(msg); alert("ERROR!"); }
const defaultProps = {
    isAuth: false,
    isOpen: false,
    onSign: () => propsError("onSign 메소드 필요!") ,
    onMenuOpen: () => propsError("onMenuOpen 메소드 필요!") ,
}

/*** 컴포넌트 정의 Start!!!! ***/
const SB_Header = props => {
    const { classes } = props;
    return (
        <AppBar // https://material-ui.com/api/app-bar/
            position="fixed"
            color={ props.isAuth ? "primary":"default" }
            className={ classNames( classes.appBar, {
                    [classes.appBarShift]: props.isOpen
                })
            }
        >
            <Toolbar disableGutters={ !props.isOpen }>
                <IconButton
                    color="inherit"
                    aria-label="Menu"
                    onClick={ event => { props.onMenuOpen(true); } }
                    className={
                        classNames(
                            classes.menuButton ,
                            props.isOpen && classes.hide , // 메뉴가 열렸으면?
                            !props.isAuth && classes.hide // 비로그인시 노출 안함
                        )
                    }
                >
                    <MenuIcon />
                </IconButton>
                
                <Typography className={classes.grow} variant="h6" color="inherit" noWrap>
                    {/* 누르면 "/"로 이동하게 해야해서 route 이용!!
                        * https://stackoverflow.com/questions/42672842/how-to-get-history-on-react-router-v4
                        * 를 하고 싶었으나 hashRouter에서 안됨 ㅠㅠ
                        */}
                    <Route path="/" component={MyHeaderTitle} />
                </Typography>

                {/* 우상단 로그인 버튼 */}
                <Button
                    color="inherit"
                    className={ classNames( !props.isAuth && classes.hide ) }
                    onClick={
                        event => { props.onSign(false); }
                    }
                >
                    SignOut
                </Button>
            </Toolbar>
        </AppBar>
    )
};

/* MaterialUI 스타일 설정 */
const styles = theme => ({
    hide: { display: 'none', },
    grow: { flexGrow: 1, },
    pointer: {cursor: 'pointer'},
    title: { color: 'white' }, 
    appBar: {
        paddingLeft: '16px',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        }),
    },
    appBarShift: {
        width: `calc(100% - ${window._drawerWidth}px)`,
        marginLeft: window._drawerWidth,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20
    }
});
SB_Header.propTypes = propTypes;
SB_Header.defaultProps = defaultProps;
export default withStyles(styles)(SB_Header);