/* [메뉴 컴포넌트]
 * - Material-UI의 Drawer 활용 중심
 * - React-rotuer 활용
 */
import './MyMenu.css';
import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
// Material-UI Compos
import withStyles from '@material-ui/core/styles/withStyles';
// import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton} from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
// 아이콘 : https://material.io/tools/icons/?icon=bookmark&style=baseline
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import AspectRatioIcon from '@material-ui/icons/AspectRatio';

/* props 설정 */
const propTypes = {
    isAuth: PropTypes.bool , // 인증 여부
    isOpen: PropTypes.bool , // 메뉴 열림 여부
    onTopLoading: PropTypes.func , // 로딩 표시 메소드
    onMenuOpen: PropTypes.func , // 메뉴 열기/닫기 메소드
    classes: PropTypes.object.isRequired
};
const propsError = msg => { console.log(msg); alert("ERROR!"); }
const defaultProps = {
    isOpen: false,
    isAuth: false,
    onTopLoading: () => propsError("로그인 메소드 필요!") ,
    onMenuOpen: () => propsError("메뉴 열기/닫기 메소드 필요!")
}
/* 컴포넌트 Start!! */
function SB_Menu(props) {
  const { classes } = props;

  return (
    <Drawer // https://material-ui.com/api/drawer/
        id="MAINMENU"
        classes={ {paper: classes.drawerPaper} }
        className={ classes.drawer }
        variant="persistent"
        anchor="left"
        open={ props.isOpen }
    >
        <div className={ classes.drawerHeader }>
            <IconButton onClick={ event => { props.onMenuOpen(false) } }>
                <ChevronLeftIcon />
            </IconButton>
        </div>
        <Divider />
        {/* 리스트 컴포넌트 :: https://material-ui.com/api/list/ */}
        <List> 
            <NavLink to="/types" activeClassName="selected">
            {/* <ListItem button onClick={ () => props.handleTopLoading( true ) }> */}
                <ListItem button>
                    <ListItemIcon><AspectRatioIcon /></ListItemIcon>
                    <ListItemText primary="배너 타입 관리" />
                </ListItem>
            </NavLink>

            <NavLink to="/banners" activeClassName="selected">
                <ListItem button className="nav-menu">
                    <ListItemIcon><BookmarkIcon /></ListItemIcon>
                    <ListItemText primary="배너 관리" />
                </ListItem>
            </NavLink>
        </List>
    </Drawer>
  );
}

/* MaterialUI 스타일 설정 */
const styles = theme => ({
    drawer: {
        width: window._drawerWidth,
        flexShrink: 0
    },
    drawerPaper: {
        width: window._drawerWidth
    },
    drawerHeader: {
        ...theme.mixins.toolbar,
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        justifyContent: 'flex-end'
    },
});
SB_Menu.propTypes = propTypes;
SB_Menu.defaultProps = defaultProps;
export default withStyles(styles)(SB_Menu);