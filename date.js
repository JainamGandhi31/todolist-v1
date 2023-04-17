const getDate = ()=>{

    const today = new Date();

    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };

    return today.toLocaleDateString("en-US", options);
}

const getDay = ()=>{

    const today = new Date();

    const options = {
        weekday: 'long',
    };
    
    return today.toLocaleDateString("en-US", options);
}

//remember that module.exports is a javascript object and it can have muliple properties and we have used that to export more than one function
// module.exports.getDate = getDate;
// module.exports.getDay = getDay;


// 2nd way
module.exports = {
    getDate: getDate,
    getDay: getDay
}