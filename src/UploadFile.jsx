import React from 'react';

const UploadFile = (props) => {
    const { getFilePath } = props;
    // onChange={getFilePath}
    return(
        <div>
            <form action="http://localhost:3333/uploadFile" method="post" enctype="multipart/form-data">
            <label for="myFileId">Select a file:</label>
            <input type="file" name="myFile" id="myFileId"></input>
            <input type="submit" value="submit"></input>
            </form>
        </div>
    )
}

export default UploadFile;