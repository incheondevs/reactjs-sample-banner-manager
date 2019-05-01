import React from 'react';
import PropTypes from 'prop-types';
import { Route, Switch } from 'react-router-dom';
import history from '../../../history';
// Material-UI Compos
import withStyles from '@material-ui/core/styles/withStyles';
// import { Typography, Button } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
// 내 컴포넌트s
import DataPage from './List'
const FormPage = React.lazy( () => import('./Form') );

/* props 설정 */
const propTypes = {
    onTopLoading: PropTypes.func, // 메인 로딩 보이기 메소드
    classes: PropTypes.object.isRequired
};
const propsError = msg => { console.log(msg); alert("ERROR!"); }
const defaultProps = {
    onTopLoading: () => propsError("onTopLoading 메소드 필요!") 
}

/*** 컴포넌트 정의 Start!!!! ***/
class SB_BannerGroups extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            naviTitle : "목록"
        }
        this.handleGoBack = this.handleGoBack.bind(this);
        this.handleGoURL = this.handleGoURL.bind(this);
        this.handleSetNaviTitle = this.handleSetNaviTitle.bind(this);
    }

    /* 서브 네비 타이틀 변경 메소드 */
    handleSetNaviTitle(naviTitle){ this.setState( {naviTitle} ); }
    /* (react-router) 뒤로가기 메소드 */
    handleGoBack(){
        this.setState( {naviTitle: "목록"} );
        history.goBack();
    }
    /* (react-router) 이동 메소드 */
    handleGoURL(url, naviTitle="알수없음?!"){ 
        this.setState( {naviTitle} );
        history.push(url);
    }

    render(){
        const { match } = this.props;

        return (
            <div>
                <Typography variant="h6" className="clearfix">
                    <span className="float-right">
                        { this.state.naviTitle !== "목록" ? (
                                <Button variant="contained" onClick={ this.handleGoBack }>돌 아 가 기</Button>
                            ) : (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={ () => this.handleGoURL(`${match.url}/create`, "추가하기") }>
                                    추 가 하 기
                                </Button>
                            )
                        }
                    </span>
                    배너 타입 관리 <small> :: { this.state.naviTitle }</small>
                </Typography>
                <br />

                <Switch>
                    <Route exact path={match.url}
                        render={() => {
                            return <DataPage {...this.props}
                                onGoURL={ this.handleGoURL }
                                onSetNaviTitle={ this.handleSetNaviTitle }
                            />
                        } }
                    />
                    {/* 추가하기 페이지 */}
                    <Route exact path={`${match.url}/create`}
                        render={() => {
                            return <FormPage {...this.props}
                                isEdit={ false }
                                naviTitle={ this.state.naviTitle }
                                onGoURL={ this.handleGoURL }
                                onGoBack={ this.handleGoBack }
                                onSetNaviTitle={ this.handleSetNaviTitle }
                            />
                        } }
                    />
                    {/* 수정하기 페이지 */}
                    <Route path={ match.url+"/:code" }
                        render={ ({ match }) => {
                            return <FormPage { ...this.props }
                                code={ match.params.code }
                                isEdit={ true }
                                naviTitle={ this.state.naviTitle }
                                onGoURL={ this.handleGoURL }
                                onGoBack={ this.handleGoBack }
                                onSetNaviTitle={ this.handleSetNaviTitle }
                            />
                        } }
                    />
                </Switch>
            </div>
        );
    }
}

const styles = theme => ({
    progress: {}
});
SB_BannerGroups.propTypes = propTypes;
SB_BannerGroups.defaultProps = defaultProps;
export default  withStyles(styles)(SB_BannerGroups);