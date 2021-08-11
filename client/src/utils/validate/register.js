export default function valid({ fullName, username, newPassword, confirmPassword, gender }) {
    
    const err = {};


    if (!startsWithAlphabet(fullName)) err.fullName = 'Full name can only start with an alphabet.'
    else if (!containsOnlyAlphabetsAndDot(fullName)) err.fullName = 'Full name can only have lowercase/uppercase alphabets and dot.';

    
    if (!startWithLowerCase(username)) err.username = 'Username can only start with a lowercase alphabet.';
    else if (!containsOnlyAlphabetsAndUnderscore(username)) err.username = 'Username can only have lowercase alphabets, digits or an underscore.';


    if (newPassword !== confirmPassword) {
        err.newPassword = 'Passwords do not match.';
        err.confirmPassword = 'Passwords do not match.';
    }


    if (!gender) err.gender = 'Please select one option.';


    return {
        err: err,
        errLength: Object.keys(err).length
    }

}


function startsWithAlphabet(fullName) {
    const re = /^[a-zA-Z]/;
    return re.test(fullName);
}

function containsOnlyAlphabetsAndDot(username) {
    const re = /^[a-zA-Z][a-zA-Z/./ ]+$/;
    return re.test(username);
}


function startWithLowerCase(username) {
    const re = /^[a-z]/;
    return re.test(username);
}


function containsOnlyAlphabetsAndUnderscore(username) {
    const re = /^[a-z][a-z0-9/_]+$/;
    return re.test(username);
}