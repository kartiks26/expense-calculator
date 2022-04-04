import React from "react";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
function DateChange(props) {
  const { value, id } = props;
  const [selectedDate, setSelectedDate] = React.useState(value);
  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <DatePicker
        className="MoboResponsive"
        format="DD-MM-YYYY"
        value={selectedDate}
        onChange={(date) => {
          setSelectedDate(date);
        }}
      />
    </MuiPickersUtilsProvider>
  );
}

export default DateChange;
