const userRoute = require('./users');
const projectRoute = require('./project');
const questionRoute = require('./questions');
module.exports = (app) => {
    app.use('/', projectRoute);
    app.use('/users', userRoute);
    app.use('/questions', questionRoute);
}