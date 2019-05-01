import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Router } from 'react-router-dom'; // 해시 라우터 사용 : 이유는 내맴~
import history from './history.js';

/*** 전역 설정 ***/
window._drawerWidth = 320; // 메뉴 drawer 넓이

/* 루트 컴포넌트를 정의 */
const RootCompo = (
    <Router history={ history }>
        <App />
    </Router>
);
ReactDOM.render( RootCompo , document.getElementById('root') );

// 문자로 로딩 상태 표시 해제 -> public/index.html에 script에서 설정함
clearInterval( window.reactRootLoading ); 
