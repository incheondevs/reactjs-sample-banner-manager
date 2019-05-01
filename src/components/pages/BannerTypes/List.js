import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
// Material-UI Compos
import withStyles from '@material-ui/core/styles/withStyles';
// import { Paper, Table, TableRow, TableCell, TableBody, TableHead } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import sampleData from './datas.json';

/* props 설정 */
const propTypes = {
    onGoURL: PropTypes.func, // react-router 이동을 위해..
    onTopLoading: PropTypes.func, // 메인 로딩 보이기 메소드
    classes: PropTypes.object.isRequired
};
const propsError = msg => { console.log(msg); alert("ERROR!"); }
const defaultProps = {
    onGoURL: () => propsError("onGoURL 메소드 필요!") ,
    onTopLoading: () => propsError("onTopLoading 메소드 필요!")
}

/*** 컴포넌트 정의 Start!!!! ***/
class SB_List extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            datas: []
        }
        this.initDatas = this.initDatas.bind(this);
        this.getDatas = this.getDatas.bind(this);
        this.deleteData = this.deleteData.bind(this);
    }

    /* @lifecycle */
    componentDidMount(){
        this.props.onTopLoading( false );
        const _datas = localStorage.getItem('BNTypeDatas');
        if( _datas === null || _datas === undefined ){
            this.initDatas();
        } else {
            setTimeout(()=>{
                this.props.onTopLoading( false );
                this.setState({
                    datas: JSON.parse(_datas)
                });
            }, 500);
        }
    }
    /* 초기 데이터 가져오기 */
    initDatas(){
        this.props.onTopLoading( true );
        setTimeout(()=>{
            this.props.onTopLoading( false );
            localStorage.setItem('BNTypeDatas', JSON.stringify(sampleData));
            this.setState({
                datas: sampleData
            });
        }, 500);
    }
    /* 데이터 가져오기 */
    getDatas(){
        this.props.onTopLoading( true );
        setTimeout(()=>{
            this.props.onTopLoading( false );
            this.setState({
                datas: JSON.parse( localStorage.getItem('BNTypeDatas') )
            });
        }, 500);
    }
    /* 데이터 삭제 메소드 */
    deleteData(item){
        if(window.confirm("삭제하면 되돌릴 수 없습니다. 정말로 삭제하시겠습니까?")){
            const _datas = this.state.datas;
            // AJAX Params 설정
            this.props.onTopLoading( true ); // 로딩 표시하기!
            setTimeout(()=>{
                _datas.splice( _datas.indexOf(item), 1 );
                localStorage.setItem('BNTypeDatas', JSON.stringify(_datas));
                this.setState({
                    datas: _datas
                });
                this.props.onTopLoading( false );
                alert("삭제되었습니다!");
            }, 500);
        }
    }

    render(){
        const { classes } = this.props;
        const rows = this.state.datas;

        return (
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell component="th" >#</TableCell>
                            <TableCell>Memo <small>(Count)</small></TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.id}>
                            <TableCell scope="row">{row.id}</TableCell>
                            <TableCell >{row.memo} <small>({row.cnt})</small></TableCell>
                            <TableCell align="center">
                                <Link to={"/types/"+row.id}>
                                    <IconButton aria-label="Edit" className={ classes.margin }>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                </Link>

                                <IconButton
                                    className={ classes.margin }
                                    aria-label="Delete"
                                    onClick={ e => {this.deleteData(row)} }
                                >
                                    <DeleteIcon fontSize="small" />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </Paper>
        );
    }
}

const styles = theme => ({
    progress: { }
});
SB_List.propTypes = propTypes;
SB_List.defaultProps = defaultProps;
export default  withStyles(styles)(SB_List);