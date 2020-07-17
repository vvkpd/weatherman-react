import React, {Component, Fragment, useEffect, useState, useRef} from 'react';
import moment from 'moment-timezone';
import {isValid} from '../../utils/validityHelper';

function CurrentInfo({forecast, address}) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const dateTimeRef = useRef();

  const setDateTime = (dateObj) => {
    setDate(dateObj ? dateObj.format('dddd, MMMM Do YYYY') : '');
    setTime(dateObj ? dateObj.format('hh:mm:ss a') : '');
    dateTimeRef.current = dateObj;
  }

  // set address
  useEffect(() => {
    if(address.title) {
      setLocation(address.title);
    }
  }, [address]);


  // setting date/time
  useEffect(() => {
      // reset time when weather changes
      //console.log(forecast.timezone);
      //console.log(moment().tz(forecast.timezone));
      if (!isValid(forecast)) {
        return;
      }

      setDateTime(moment().tz(forecast.timezone));


      const dateTimer = setInterval(
        () => {
          if (forecast.time) {
            const dateTimeObj = moment.tz(dateTimeRef.current, forecast.timezone).add(1 , 's');
            setDateTime(dateTimeObj);
          }

        }
        ,1000);

      // increment timer by 1 sec
      return () => {
        clearInterval(dateTimer)
      };


  }, [forecast]);

  return (isValid(forecast) ?
    <div className="p-2">
    { location ?
      (<p className="mb-2">{location}
        </p>)
        : ''
    }
    { date && time ?
     (<Fragment>
       <p className="mb-2">
        {date}
        <span> | </span>
        {time}
       </p>
     </Fragment>) : null
    }
    </div> : null
  );
}

export default CurrentInfo;
