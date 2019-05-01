import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// Material-UI Compos
import withStyles from '@material-ui/core/styles/withStyles';
import Button from '@material-ui/core/Button';

/* props 설정 */
const propTypes = {
    isAuth: PropTypes.bool , // 인증 여부
    onSign: PropTypes.func , // 로그인/아웃 메소드
    classes: PropTypes.object.isRequired
};
const propsError = msg => { console.log(msg); alert("ERROR!"); }
const defaultProps = {
    isAuth: false,
    onSign: () => propsError("로그인 메소드 필요!")
}

/*** 컴포넌트 정의 Start!!!! ***/
const SB_SignIn = props => {
    const { classes } = props;

    return (
        <div className={ classNames( props.isAuth && classes.hide ) }>
            <Button
                className={ classes.button }
                variant="contained"
                color="primary"
                onClick={ e => { props.onSign(true) } }
            >
                SignIn
            </Button>
        </div>
    );
}

/* MaterialUI 스타일 설정 */
const styles = theme => ({
    hide: { display: 'none' },
});
SB_SignIn.propTypes = propTypes;
SB_SignIn.defaultProps = defaultProps;
export default withStyles(styles)(SB_SignIn);;