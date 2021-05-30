import React from 'react';

const ShellButton = (props) => {

    const {runShellScript} = props;

    return(
        <div>
            <button id="shell" onClick={runShellScript}>Run script</button>
        </div>
    )
}

export default ShellButton;