const userRoute = require('./users');
const projectRoute = require('./project');
module.exports = (app) => {
    app.use('/', projectRoute);
    app.use('/users', userRoute);
}