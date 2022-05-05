const userRoute = require('./users');
const loginRoute = require('./login');
const questionRoute = require('./questions');
module.exports = (app) => {
    app.use('/', loginRoute);
    app.use('/users', userRoute);
    app.use('/questions', questionRoute);
}