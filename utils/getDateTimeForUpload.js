/**
 * Returns date and time in a string format for upload record.
 * @returns Date and Time in string format => date_time.
 */
module.exports = () => {
    
    const today = new Date();
    const date = today.getFullYear() + '' + (today.getMonth() + 1) + '' + today.getDate();

    const hour = (today.getHours() < 10 ? '0' + today.getHours() : today.getHours());
    const minutes = (today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes());
    const seconds = (today.getSeconds() < 10 ? '0' + today.getSeconds() : today.getSeconds());

    const time = hour + '' + minutes + '' + seconds;
    const dateTime = date + '_' + time;

    return dateTime;
}