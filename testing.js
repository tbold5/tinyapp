function generateRandomString() {
    // toString method 0-9 gives numbers, 10-36 gives alphabets
    // substr(7) to print 6
     return Math.random().toString(36).substr(2,6);
    };
    console.log(generateRandomString())