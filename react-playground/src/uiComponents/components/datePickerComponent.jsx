import React, { useState } from "react";
import DatePicker from "react-multi-date-picker";

const DatePickerComponent = () => {
  const [date, setDate] = useState({ startDate: 0, endDate: 0 });

  const handleChange = (value) => {
    let data = {};
    if (value.length > 1) {
      data = {
        startDate: new Date(value[0]?.toDate?.().toString()).getTime(),
        endDate: new Date(value[1]?.toDate()?.toString()).getTime(),
      };
    } else {
      data = { startDate: 0, endDate: 0 };
    }
    setDate({ ...data });
  };

  return (
    <>
      Date Picker: <br />
      <div>
        start Date: {date.startDate}
        <div>end Date: {date?.endDate}</div>
      </div>
      <DatePicker
        className="bg-red-200 bg-blue-10"
        range
        rangeHover
        dateSeparator=" to "
        placeholder="Select Date"
        onChange={handleChange}
      />
    </>
  );
};

export default DatePickerComponent;
