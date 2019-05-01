import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import history from '../../../history';
// Material-UI Compos
import withStyles from '@material-ui/core/styles/withStyles';
import { Paper, Button, TextField, Typography } from '@material-ui/core';

/* props 설정 */
const propTypes = {
    naviTitle: PropTypes.string,
    onGoBack: PropTypes.func, // 뒤로가기 메소드
    onGoURL: PropTypes.func, //
    onSetNaviTitle: PropTypes.func, // 페이지 서브네비 타이틀 설정 메소드
    onTopLoading: PropTypes.func, // 메인 로딩 보이기 메소드
    classes: PropTypes.object.isRequired
};
const propsError = msg => { console.log(msg); alert("ERROR!"); }
const defaultProps = {
    onGoBack: () => propsError("onGoBack 메소드 필요!") ,
    onSetNaviTitle: () => propsError("onSetNaviTitle 메소드 필요!") ,
    onTopLoading: () => propsError("onTopLoading 메소드 필요!") ,
}

/*** 컴포넌트 정의 Start!!!! ***/
class SB_Form extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            isEdit: false,
            code: 0,        
            IV_type: 0,
            IV_name: "",
            IV_memo: "",
            IV_contents: "",
            bannerTypes: [], // 베너 타입 정보
        }
        this.handleChangeInput = this.handleChangeInput.bind(this);
        this.getDefaultData = this.getDefaultData.bind(this);
        this.handleFormSubmit2Write = this.handleFormSubmit2Write.bind(this);
        this.handleFormSubmit2Modify = this.handleFormSubmit2Modify.bind(this);
    }

    /* @Lifecycle */
    componentDidMount(){
        if(this.props.isEdit){
            if( this.props.naviTitle !== "수정하기" ) this.props.onSetNaviTitle("수정하기");
            if( this.props.code && this.props.code>0 ){
                this.getDefaultData(this.props.code);
            }else{ // 정보가 없으니 경고 띄우고 돌아가기
                alert("ERROR!");
                history.goBack();
            }
        }else{ // 앱(그룹) 가져오기
            if(this.props.naviTitle !== "추가하기") this.props.onSetNaviTitle("추가하기");
            setTimeout(()=>{
                const _types = JSON.parse( localStorage.getItem('BNTypeDatas') );
                this.setState({
                    bannerTypes: _types,
                    IV_type: _types[0].id,
                });
                this.props.onTopLoading( false );
            }, 500);
        }
        
    }
    /* 기존 정보 가져오기 */
    getDefaultData(code){
        this.props.onTopLoading( true );
        setTimeout(()=>{
            const _types = JSON.parse( localStorage.getItem('BNTypeDatas') );
            const _datas = JSON.parse( localStorage.getItem('BannerDatas') );
            for (const item of _datas) {
                if(Number(item.id) === Number(code)){
                    this.setState({
                        code: item.id,
                        IV_type: item.type_id,
                        IV_name: item.name,
                        IV_memo: item.memo,
                        IV_contents: item.contents,
                        created: item.created_at,
                        updated: (item.updated_at?item.updated_at:"없음"),
                        bannerTypes: _types,
                    });
                    this.props.onTopLoading( false );
                    break;
                }
                this.props.onTopLoading( false );
            }

        }, 500);
    }
    /* 등록 처리 API */
    handleFormSubmit2Write( e ){
        const type = this.state.IV_type;
        const name = this.state.IV_name;
        const contents = this.state.IV_contents;
        const memo = this.state.IV_memo;
        // 유효성 검사
        if ( name.length < 2 ) {
            alert("제목을 2~30자로 입력하세요!");
            return;
        }
        if ( contents.length < 5 ) {
            alert("내용을 5~30자로 입력하세요!");
            return;
        }
        // AJAX Params 설정
        this.props.onTopLoading( true ); // 로딩 표시하기!
        setTimeout(()=>{
            const _datas = JSON.parse( localStorage.getItem('BannerDatas') );
            let maxId = 0;
            for (const item of _datas) {
                maxId = maxId>item.id ? maxId : item.id;
            }
            const created_at = (new Date()).toLocaleString();
            const _item = { id: ++maxId,
                created_at, memo, name, contents,
                cnt_total: 1,
                type_id: type,
                updated_at: null
            }; // 새 아이템
            _datas.push(_item);
            localStorage.setItem('BannerDatas', JSON.stringify(_datas) );
            this.props.onGoURL("/banners", "목록");
        }, 500);
    }
    /* 수정 처리 API */
    handleFormSubmit2Modify( e ){
        const type = this.state.IV_type;
        const name = this.state.IV_name;
        const contents = this.state.IV_contents;
        const memo = this.state.IV_memo;
        // 유효성 검사
        if ( name.length < 2 ) {
            alert("제목을 2~30자로 입력하세요!");
            return;
        }
        if ( contents.length < 5 ) {
            alert("내용을 5~30자로 입력하세요!");
            return;
        }
        this.props.onTopLoading( true ); // 로딩 표시하기!
        setTimeout(()=>{
            const updated_at = (new Date()).toLocaleString();
            const code = Number(this.state.code);
            const _datas = JSON.parse( localStorage.getItem('BannerDatas') );
            for (let i = 0; i < _datas.length; i++) {
                if(Number(_datas[i].id) === code){
                    _datas[i].memo = memo;
                    _datas[i].name = name;
                    _datas[i].type_id = type;
                    _datas[i].contents = contents;
                    _datas[i].updated_at = updated_at;
                    break;
                }
            }
            localStorage.setItem('BannerDatas', JSON.stringify(_datas) );
            this.props.onGoURL("/banners", "목록");
        }, 500);
    }
    /* 이벤트 처리 */
    handleChangeInput = prop => event => {
        this.setState({ [prop]: event.target.value });
    };
    
    render(){
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Paper className={classes.root}>
                    { this.state.bannerTypes.length<1 ? ("로딩중") : (
                        <React.Fragment>
                            <Typography variant="h5" component="h3">
                                배너 추가하기
                            </Typography>
                            <br />
                            {/* 텍스트 필드 :: https://material-ui.com/demos/text-fields/ */}
                            <br /><br />
                            <TextField
                                label="배너 타입(크기) 선택"
                                select
                                className={ classNames(classes.margin, classes.textField) }
                                variant="outlined"
                                fullWidth
                                SelectProps={{
                                    native: true,
                                    MenuProps: {
                                        className: classes.menu,
                                    },
                                }}
                                value={ this.state.IV_type }
                                onChange={ this.handleChangeInput('IV_type') }
                            >
                                { this.state.bannerTypes.map(option => (
                                    <option  key={option.id} value={option.id}>
                                        {option.memo}
                                    </option >)
                                )}
                            </TextField>
                            <TextField
                                label="이름"
                                className={classes.textField}
                                required
                                placeholder="구분용, 2자 이상"
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                value={ this.state.IV_name }
                                onChange={ this.handleChangeInput('IV_name') }
                            />
                            <TextField
                                label="페이지 내용 (HTML로 작성)"
                                className={classes.textField}
                                required
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                multiline={true}
                                rows={20}
                                rowsMax={1000}
                                value={ this.state.IV_contents }
                                onChange={ this.handleChangeInput('IV_contents') }
                            />
                            <TextField
                                label="메모"
                                className={classes.textField}
                                margin="normal"
                                variant="outlined"
                                fullWidth
                                multiline={true}
                                rows={3}
                                rowsMax={10}
                                value={ this.state.IV_memo }
                                onChange={ this.handleChangeInput('IV_memo') }
                            />
                        </React.Fragment>
                    )}
                </Paper>
                {/* 등록하기 버튼 */}
                <div>
                    <br />
                    <Button
                    variant="contained"
                    color="primary"
                    className={ classes.button }
                    fullWidth={ true }
                    onClick={ this.props.isEdit ? this.handleFormSubmit2Modify : this.handleFormSubmit2Write }
                >
                    { this.props.isEdit ? "수 정 하 기" : "등 록 하 기" }
                </Button>
            </div>
            </React.Fragment>
        );
    }
}

const styles = theme => ({
    progress: {},
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    },
});
SB_Form.propTypes = propTypes;
SB_Form.defaultProps = defaultProps;
export default  withStyles(styles)(SB_Form);