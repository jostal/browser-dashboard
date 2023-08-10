function parseDate(date, format) {
  // get date components
  let dayNum = date.getDate()
  let day = date.getDay()
  let month = date.getMonth()
  let year = date.getFullYear()

  // parse format
  let formatArr = format.split(/(?:,| |\/|-)+/)
  let seperatorArr = format.match(/[^a-zA-Z0-9]+/g)

  // construct date string
  let dateStr = ""

  formatArr.forEach((spec, i) => {
    dateStr += formatDate(spec, date)
    if (i < formatArr.length - 1) {
      dateStr += seperatorArr[i]
    }
  })

  return dateStr
}

function formatDate(format, date) {
  let formatted
  switch (format) {
    case "d":
      formatted = date.getDate();
      break;
    case "dd":
      let dayNum = date.getDate();
      formatted = dayNum < 10 ? `0${dayNum}` : dayNum
      break;
    case "ddd":
      formatted = getDayAbbrev(date.getDay())
      break;
    case "dddd":
      formatted = getDayFull(date.getDay())
      break;
    case "M":
      formatted = date.getMonth()
      break;
    case "MM":
      let month = date.getMonth()
      formatted = month < 10 ? `0${month}` : month
      break;
    case "MMM":
      formatted = getMonthAbbrev(date.getMonth())
      break;
    case "MMMM":
      formatted = getMonthFull(date.getMonth())
      break;
    case "yy":
      formatted = date.getFullYear().toString().slice(-2)
      break;
    case "yyyy":
      formatted = date.getFullYear()
  }

  return formatted
}

function getDayAbbrev(day) {
  let abbrev
  switch (day) {
    case 0:
      abbrev = "Sun"
      break;
    case 1:
      abbrev = "Mon"
      break;
    case 2:
      abbrev = "Tue"
      break;
    case 3:
      abbrev = "Wed"
      break;
    case 4:
      abbrev = "Thu"
      break;
    case 5:
      abbrev = "Fri"
      break;
    case 6:
      abbrev = "Sat"
      break;
  }

  return abbrev
}


function getDayFull(day) {
  let dayFull
  switch (day) {
    case 0:
      dayFull = "Sunday"
      break;
    case 1:
      dayFull = "Monday"
      break;
    case 2:
      dayFull = "Tuesday"
      break;
    case 3:
      dayFull = "Wednesday"
      break;
    case 4:
      dayFull = "Thursday"
      break;
    case 5:
      dayFull = "Friday"
      break;
    case 6:
      dayFull = "Saturday"
      break;
  }

  return dayFull
}

function getMonthAbbrev(month) {
  let retMonth;

  switch (month) {
    case 0:
      retMonth = "Jan"
      break;
    case 1:
      retMonth = "Feb"
      break;
    case 2:
      retMonth = "Mar"
      break;
    case 3:
      retMonth = "Apr"
      break;
    case 4:
      retMonth = "May"
      break;
    case 5:
      retMonth = "Jun"
      break;
    case 6:
      retMonth = "Jul"
      break;
    case 7:
      retMonth = "Aug"
      break;
    case 8:
      retMonth = "Sep"
      break;
    case 9:
      retMonth = "Oct"
      break;
    case 10:
      retMonth = "Nov"
      break;
    case 11:
      retMonth = "Dec"
      break;
  }

  return retMonth
}


function getMonthFull(month) {
  let retMonth;

  switch (month) {
    case 0:
      retMonth = "January"
      break;
    case 1:
      retMonth = "February"
      break;
    case 2:
      retMonth = "March"
      break;
    case 3:
      retMonth = "April"
      break;
    case 4:
      retMonth = "May"
      break;
    case 5:
      retMonth = "June"
      break;
    case 6:
      retMonth = "July"
      break;
    case 7:
      retMonth = "August"
      break;
    case 8:
      retMonth = "September"
      break;
    case 9:
      retMonth = "October"
      break;
    case 10:
      retMonth = "November"
      break;
    case 11:
      retMonth = "December"
      break;
  }

  return retMonth
}

export { parseDate }
