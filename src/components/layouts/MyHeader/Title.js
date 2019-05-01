/* [헤더 타이틀]
 * - Route history 때문에 분리함...
 */
import React from 'react';

/*** 컴포넌트 정의 Start!!!! ***/
class SB_HeaderTitle extends React.Component {
    constructor(props){
        super(props);
        this.handleGoURL = this.handleGoURL.bind(this);
    }    

    /* (react-router) 이동 메소드 */
    handleGoURL(url){ 
        this.props.history.push(url);
    }
    
    render(){
        return (
            <span
                style={ {cursor: "pointer"} }
                onClick={ () => { this.handleGoURL("/"); } }
            >
                My Banner Management System
            </span>
        );
    }
}

export default SB_HeaderTitle;