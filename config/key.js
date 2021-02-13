if(process.env.NODE_ENV === 'prodution') {
    module.exports = require('./prod')

}
else {
    module.exports = require('./dev')
}