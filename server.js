const express = require('express');
const path = require('path');
const cookieSession = require('cookie-session');
const createError = require('http-errors');
const bodyParser = require('body-parser');

const FeedbackService = require ('./services/FeedbackService');
const SpeakerService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakerService = new SpeakerService('./data/speakers.json');

const routes = require('./routes');
const { join } = require('path');
const { response } = require('express');

const app = express();

const port = 3000;

app.set('trust proxy', 1);

app.use(cookieSession({
        name: 'session',
        keys: ['Gadfdjdli211', 'dKsaslkj823'],
    })
);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.locals.siteName = 'ROUX Meetups';

app.use(express.static(path.join(__dirname, './static')));

app.get('/throw', (request,respnose,next) => {
    setTimeout(() => {
        return next(new Error('Something went wrong!'));
    }, 500);
    
})

app.use(async (request, response, next) => {
    const names = await speakerService.getNames();
    response.locals.speakerNames = names;
    return next();
});

app.use('/', routes({
    feedbackService,
    speakerService
}));

app.use((request, response, next) => {
    return next(createError(404, 'File not found'));
});

app.use((err, request, response, next) => {
    response.locals.message = err.message;
    const status = err.status || 500;
    response.locals.status = status;
    response.status(status);
    response.render('error');
});

app.listen(port, () => {
    console.log(`Express server listening on port ${port}`);
});