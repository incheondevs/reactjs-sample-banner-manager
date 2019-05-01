import './MyFooter.css';
import React from 'react';

// functional compo
const SB_Footer = props => {
  return (
    <footer>
        <ul>
            <li><a target="_blank" rel="noopener noreferrer" href="https://reactjs.org/docs/getting-started.html" >React Docs</a></li>
            <li><a target="_blank" rel="noopener noreferrer" href="https://reacttraining.com/react-router/web/guides/quick-start">React Router</a></li>
            <li><a target="_blank" rel="noopener noreferrer" href="https://material-ui.com/getting-started/usage/">Material-UI</a></li>
            <li><a target="_blank" rel="noopener noreferrer" href="https://github.com/axios/axios">Axios</a></li>
        </ul>
    </footer>
  );
}

export default SB_Footer;