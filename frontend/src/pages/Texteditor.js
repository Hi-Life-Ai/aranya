import React, { useState } from 'react';
import MUIEditor, { MUIEditorState } from "react-mui-draft-wysiwyg";


function Texteditor(){

       // // Text Editor
    const [editorState, setEditorState] = useState(
        MUIEditorState.createEmpty(),
    )
    const onChange = newState => {
        setEditorState(newState)
    }

    return(
        <>
            <MUIEditor 
                editorState={editorState} 
                onChange={onChange}
                // value={product.productdescription}
                // onChange={(e) => { setProduct({ ...product, productdescription: e.target.value }) }}
            />
        </>
    )
}

export default Texteditor;