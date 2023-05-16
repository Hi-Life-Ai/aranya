import {Button} from '@mui/material';
import { userStyle } from '../PageStyle';
import { toast } from 'react-toastify';

function SendToServer({ sendJSON }) {
    return (
        <div>
            <Button variant="contained" sx={userStyle.buttonadd} onClick={() => { sendJSON() ;toast.success("Saved Successfully",{
        position: toast.POSITION.TOP_CENTER
    }); }}>
            Submit
            </Button>
        </div>
    );
}
export default SendToServer;