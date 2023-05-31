import moment from "moment";

export const formatTxDate = (date, isUnix = false) => {
  let txDate;

  if (isUnix) {
    txDate = moment.unix(date);
  } else {
    txDate = moment(date);
  }

  if (txDate.isValid()) {
    // txDate = txDate.fromNow();
    txDate = txDate.format("MMMM Do YYYY, h:mm a");
    return txDate;
  }
  return date;
};
