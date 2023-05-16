import {React, useState} from 'react';
import { DateRangePicker } from 'rsuite';
import {subDays,addDays,startOfMonth,endOfMonth,endOfYear,subYears,addMonths,} from 'date-fns/';
import "rsuite/dist/rsuite.css";

function Daterangepicker() {
  const predefinedRanges = [
    { label: 'Today', value: [new Date(), new Date()], placement: 'left', },
    { label: 'Yesterday', value: [addDays(new Date(), -1), addDays(new Date(), -1)], placement: 'left', },
    { label: 'Last 7 days', value: [subDays(new Date(), 6), new Date()], placement: 'left' },
    { label: 'Last 30 days', value: [subDays(new Date(), 29), new Date()], placement: 'left' },
    { label: 'This month', value: [startOfMonth(new Date()), endOfMonth(new Date())], placement: 'left' },
    { label: 'Last month', value: [startOfMonth(addMonths(new Date(), -1)),endOfMonth(addMonths(new Date(), -1))], placement: 'left' },
    { label: 'This month last year', value: [subYears(startOfMonth(new Date()),1 ), subYears(endOfMonth(new Date()), 1)], placement: 'left' },
    { label: 'This year', value: [new Date(new Date().getFullYear(), 0, 1), endOfYear(new Date())], placement: 'left' },
    { label: 'Last year', value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date(new Date().getFullYear(), 0, 0)], placement: 'left' },
    { label: 'Current Financial year', value: [new Date(new Date().getFullYear(), 0, 1), endOfYear(new Date())], placement: 'left' },
    { label: 'Last Financial year', value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date(new Date().getFullYear(), 0, 0)], placement: 'left' },
  ];
  const [value, setValue] = useState([new Date(), new Date()]);
  return (
        <DateRangePicker
          fullWidth
          ranges={predefinedRanges}
          showOneCalendar
          format="MM/dd/yyyy"
          character=" - "
          onChange={setValue}
          value={value}
          style={{width:'100% !important', border: '1px solid #B97DF0',borderRadius: 7, '& .rsStackItem':{width:"100%"}, '& .rsPickerToggleWrapper':{width:"100%"}}}
          size="lg"
        />
  );
}

export default Daterangepicker;