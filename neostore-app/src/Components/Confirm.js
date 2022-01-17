import React from 'react';
import { Link } from 'react-router-dom';

function Confirm() {
    return (
        <div>
            <h2>Your email address is confirmed</h2>
            <Link to='/login'></Link>
        </div>
    )
}

export default Confirm
