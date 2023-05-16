import { Button } from '@mui/material';
import { userStyle } from './PageStyle';
function SendToServer({ sendJSON }) {
    return (
        <div>
            {/* <button></button> */}
            <Button variant="contained" sx={userStyle.buttonadd} onClick={() => { sendJSON() }}>
                Submit
            </Button>
        </div>
    );
}
export default SendToServer;