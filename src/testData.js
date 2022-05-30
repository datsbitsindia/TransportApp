// import package
const inplay = require('pulldata-bet-api'); 
//define inplay
let game = new inplay(); 
//insert params
game.getInplay().then((rest) => {

    for (data of rest) {
        console.log(rest.ptData)
    }

}).catch((err) => {

    console.log('Error: ' + err)

})