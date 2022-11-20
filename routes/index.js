const express = require('express');
const router = express.Router();

const speakersRoute = require('./speakers'); 
const feedbackRoute = require('./feedback'); 

module.exports = params => {
    const { speakerService } = params;

    router.get('/', async (request, response, next) => {
        try {
            const topSpeakers = await speakerService.getList();
            const artwork = await speakerService.getAllArtwork();
            console.log(topSpeakers);
            return response.render('layout', {pageTitle: 'Welcome', template: 'index', topSpeakers, artwork });    
        } catch(err) {
            return next(err);
        }

        // if(!request.session.visitcount) {
        //     request.session.visitcount = 0;
        // }
        // request.session.visitcount += 1;
        // console.log(`Number of visits: ${request.session.visitcount}`);
        

    });
    router.use('/speakers', speakersRoute(params));
    router.use('/feedback', feedbackRoute(params));
    return router;
}