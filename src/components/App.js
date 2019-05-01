import './App.css';
import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Route, Switch } from 'react-router-dom';
// MyLayout Compos
import MyHeader from './layouts/MyHeader'; // == AppBar
import MyMenu from './layouts/MyMenu'; // == Drawer
import MyFooter from './layouts/MyFooter'; 
import Signin from './pages/Signin'; // 기본 로그인 화면
// Material-UI Compos
import withStyles from '@material-ui/core/styles/withStyles';
// import { CssBaseline, Typography, LinearProgress, CircularProgress } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import LinearProgress from '@material-ui/core/LinearProgress';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import history from '../history';
/*** 코드 분할 및 동적 로딩 ***/
// lazy() :: https://reactjs.org/docs/code-splitting.html
const BannerTypesPage = React.lazy( () => import('./pages/BannerTypes') );
const BannersPage = React.lazy( () => import('./pages/Banners') );

/* props 설정 */
const propTypes = {
  // MaterialUI용 theme + calss
  theme: PropTypes.object.isRequired, classes: PropTypes.object.isRequired
};
/*** 컴포넌트 정의 Start!!!! ***/
class SB_App extends React.Component {
    constructor(props){
        super(props)
        // 상태 설정
        this.state = {    
            isLaoding: false, // 페이지 로딩 프로그래스 동작 여부
            isAuth: false, // 인증(로그인) 상태 여부
            isOpen: false, // 메뉴 Drawer 오픈 여부
            // isOpen: true, isAuth: true // 디버그용
        };
        // 인스턴스 메소드 this 바인딩
        this.handleTopLoadingStateChanged = this.handleTopLoadingStateChanged.bind(this); // onTopLoading
        this.handleSignStateChanged = this.handleSignStateChanged.bind(this); // onSign
        this.handleMenuOpenStateChanged = this.handleMenuOpenStateChanged.bind(this); // onMenuOpen
    }
  
    /** 화면 로딩 Progress 보이기 여부 변경 **/
    handleTopLoadingStateChanged = isLaoding => { this.setState( {isLaoding} ); }; 
    /** 메뉴 drawer 보이기 여부 변경 **/
    handleMenuOpenStateChanged = isOpen => { this.setState( {isOpen} ); };
    /** 인증 상태 변경 **/
    handleSignStateChanged = isAuth => {
        this.setState({ isLaoding: true });
        setTimeout(() => { // 비동기 로그인/로그아웃...인 척하는..
            this.setState({
                isAuth ,
                isOpen: isAuth ? this.state.isOpen:false ,
                isLaoding: false
            });
            // TODO 로그아웃 하면 루트 페이지로 redirect 
            if (!isAuth) history.push("/");
        }, isAuth?1500:500);
    };

    render() {
        const { classes } = this.props;

        return (
            <div id="APP" className={classes.root}>
                {/* 로딩 프로그래스바 */}
                <div className={ classNames(classes.loadingPrograss, !this.state.isLaoding && classes.hide ) } >
                    <LinearProgress color="secondary"/>
                </div>
                <CssBaseline />

                <MyHeader id="HEADER"
                    isAuth={ this.state.isAuth }
                    isOpen={ this.state.isOpen }
                    onSign={ this.handleSignStateChanged }
                    onMenuOpen={ this.handleMenuOpenStateChanged }
                />
                
                <MyMenu
                    isAuth={ this.state.isAuth }
                    isOpen={ this.state.isOpen }
                    onTopLoading={ this.handleTopLoadingStateChanged }
                    onMenuOpen={ this.handleMenuOpenStateChanged }
                />

                <main id="MAIN"
                    className={ classNames(
                        classes.content, {
                            [classes.contentShift]: this.state.isOpen
                        })
                    }
                >
                    <div className={classes.drawerHeader} />

                    {/** 컨텐츠 화면 영역 **/}
                    <React.Suspense // lazy 컴포넌트를 불러올 동안...
                        // 대체 표시할 컴포넌트를 fallback으로 설정
                        fallback={ <CircularProgress className={classes.progress} />
                    }>
                        {/* 컴포넌트 동적 로딩 : https://reactjs.org/docs/code-splitting.html
                          * props 전달 : https://reacttraining.com/react-router/web/guides/basic-components/route-rendering-props
                          */}
                        <Switch>
                            <Route exact path="/" component={ () => 
                                    this.state.isAuth ? ( // 로그인 되었을을 경우 내
                                        <Typography paragraph>
                                            샘플입니다
                                        </Typography>
                                    ) : ( // 로그인 되지 않았을 경우 
                                        <Signin
                                            onSign={ this.handleSignStateChanged }
                                            isAuth={ this.state.isAuth }
                                        />
                                    )
                                }
                            />
                            <Route path="/banners"
                                render={ props => 
                                    (<BannersPage {...props} onTopLoading={ this.handleTopLoadingStateChanged } />)
                                }
                            />
                            
                            <Route path="/types"
                                render={ props =>
                                    (<BannerTypesPage {...props} onTopLoading={ this.handleTopLoadingStateChanged } />)
                                }
                            />
                        </Switch>
                    </React.Suspense>

                    <MyFooter/>
                </main>
            </div>
        );
    }
}

/* MaterialUI 스타일 설정 */
const styles = theme => ({
    root: { display: 'flex', },
    hide: { display: 'none', },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: '0 8px',
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end'
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
        marginLeft: -window._drawerWidth,
        minHeight: '100vh',
        position: 'relative',
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen
        })
    },
    contentShift: {
        marginLeft: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen
        })
    },
    // 메인 로딩 프로그래스바
    loadingPrograss: {
        position: 'fixed',
        zIndex: '9999',
        width: '100%',
        top: 0
    }
});

SB_App.propTypes = propTypes;
export default withStyles(styles, { withTheme: true } )(SB_App);
/* ==
    const exportCompo = withStyles(styles, { withTheme: true } )
    export default exportCompo(MyApp);
*/