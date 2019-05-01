import React from 'react';
import PropTypes from 'prop-types';
import history from '../../../history';
// Material-UI Compos
import withStyles from '@material-ui/core/styles/withStyles';
// import { Paper, Button, TextField, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

/* props 설정 */
const propTypes = {
    naviTitle: PropTypes.string,
    onGoBack: PropTypes.func, // 뒤로가기 메소드
    onGoURL: PropTypes.func, // 페이지 전환 메소드
    onSetNaviTitle: PropTypes.func, // 페이지 서브네비 타이틀 설정 메소드
    onTopLoading: PropTypes.func, // 메인 로딩 보이기 메소드
    isEdit: PropTypes.bool, // 수정 모드 여부
    // code: PropTypes.number, // 수정시 필요
    classes: PropTypes.object.isRequired
};
const propsError = msg => { console.log(msg); // alert("ERROR!");
}
const defaultProps = {
    isEdit: false,
    code: 0,
    onSetNaviTitle: () => propsError("onSetNaviTitle 메소드 필요!") ,
    onGoBack: () => propsError("onGoBack 메소드 필요!") ,
    onTopLoading: () => propsError("onTopLoading 메소드 필요!")
}

/*** 컴포넌트 정의 Start!!!! ***/
class SB_Form extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            code: 0,
            IV_memo: "" // input 태그 데이터 바인딩
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.getDefaultData = this.getDefaultData.bind(this);
        this.handleFormSubmit2Write = this.handleFormSubmit2Write.bind(this);
        this.handleFormSubmit2Modify = this.handleFormSubmit2Modify.bind(this);
    }

    /* @Lifecycle 마운트시 */
    componentDidMount(){ 
        if(this.props.isEdit){
            if( this.props.naviTitle !== "수정하기" ) this.props.onSetNaviTitle("수정하기");
            if( this.props.code && this.props.code>0 ){
                this.getDefaultData(this.props.code);
            }else{ // 정보가 없으니 경고 띄우고 돌아가기
                alert("ERROR!");
                history.goBack();
            }
        }else{
            if(this.props.naviTitle !== "추가하기") this.props.onSetNaviTitle("추가하기");
        }
    }
    /* 기존 정보 가져오기 */
    getDefaultData(code){
        this.props.onTopLoading( true );
        setTimeout(()=>{
            const _datas = JSON.parse( localStorage.getItem('BNTypeDatas') );
            for (const item of _datas) {
                if(Number(item.id) === Number(code)){
                    this.setState({
                        code: item.id,
                        IV_memo: item.memo
                    });
                    this.props.onTopLoading( false );
                    break;
                }
                this.props.onTopLoading( false );
            }
        }, 500);
    }

    // https://reactjs.org/docs/forms.html
    handleChange(event) {
        this.setState( {IV_memo: event.target.value} );
    }
  
    /* 등록 처리 API */
    handleFormSubmit2Write( e ){
        const memo = this.state.IV_memo;
        // 유효성 검사
        if ( memo.length < 2 ) {
            alert("메모를 2~30자로 입력하세요!");
            return;
        }
        this.props.onTopLoading( true ); // 로딩 표시하기!
        setTimeout(()=>{
            const _datas = JSON.parse( localStorage.getItem('BNTypeDatas') );
            let maxId = 0;
            for (const item of _datas) {
                maxId = maxId>item.id ? maxId : item.id;
            }
            const _item = { id: ++maxId, cnt: 0, memo }; // 새 아이템
            _datas.push(_item);
            localStorage.setItem('BNTypeDatas', JSON.stringify(_datas) );
            this.props.onGoURL("/types", "목록");
        }, 500);
    }
    /* 수정 처리 API */
    handleFormSubmit2Modify( e ){
        const memo = this.state.IV_memo;
        // 유효성 검사
        if ( memo.length < 2 ) {
            alert("메모를 2~30자로 입력하세요!");
            return;
        }
        this.props.onTopLoading( true ); // 로딩 표시하기!
        setTimeout(()=>{
            const code = Number(this.state.code);
            const _datas = JSON.parse( localStorage.getItem('BNTypeDatas') );
            for (let i = 0; i < _datas.length; i++) {
                if(Number(_datas[i].id) === code){
                    _datas[i].memo = memo;
                    break;
                }
            }
            localStorage.setItem('BNTypeDatas', JSON.stringify(_datas) );
            this.props.onGoURL("/types", "목록");
        }, 500);
    }


    render(){
        const { classes } = this.props;

        return (
            <React.Fragment>
                <Paper className={classes.root}>
                    <Typography variant="h5" component="h3">
                        배너타입 { this.props.naviTitle }
                    </Typography>
                    <br />
                    { this.props.isEdit ? ( // 수정 모드일때
                        <TextField label="Code"
                            className={classes.textField}
                            disabled
                            margin="normal"
                            variant="filled"
                            value={ this.state.code }
                        />
                    ):"" }
                    
                    <TextField label="메모(구분 정보)"
                        className={classes.textField}
                        required
                        placeholder="배너 사이즈 등의 정보를 함께 기입하세요."
                        margin="normal"
                        variant="outlined"
                        fullWidth
                        value={ this.state.IV_memo }
                        onChange={ this.handleChange } 
                    />
                </Paper>
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
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    }
});
SB_Form.propTypes = propTypes;
SB_Form.defaultProps = defaultProps;
export default  withStyles(styles)(SB_Form);