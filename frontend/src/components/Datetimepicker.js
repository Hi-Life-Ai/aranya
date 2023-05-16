import React from 'react';
import { DatePicker } from 'rsuite';
import "rsuite/dist/rsuite.css";
function Datetimepicker(){
    return(
        <DatePicker
           format="dd/MM/yyyy HH:mm"
           calendarDefaultDate={new Date()}
           ranges={[ { label: 'Now', value: new Date() } ]}
           placeholder=""
           defaultValue={new Date()}
           size="md"
           style={{border: '1px solid #B97DF0', borderRadius: 7}}
        />
    );
}
export default Datetimepicker;