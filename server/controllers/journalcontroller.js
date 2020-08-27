const express = require('express'); //importing Express framework and store it inside the variable.
const router = express.Router();
const validateSession = require('../middleware/validate-session');
// const journal = require('../models/journal');// this was auto created
const Journal =require('../db').import('../models/journal');


router.get('/practice',validateSession ,function(req, res)
{
    res.send('Hey!! This is a practice route!')
});

// create
router.post('/create', validateSession, (req, res) => {
    const journalEntry = {
        title: req.body.journal.title,
        date: req.body.journal.date,
        entry: req.body.journal.entry,
        owner: req.user.id
    }

    Journal.create(journalEntry)
    .then(journal => res.status(200).json(journal))
    .catch(err => res.status(500).json({error: err}))
});

// Get All---http://localhost:3000/journal/

router.get('/',(req,res)=>{
    Journal.findAll()
    .then(journals => res.status(200).json(journals))
    .catch(err => res.status(500).json({error: err}))
});

//Put or update method/----http://localhost:3000/journal/update/3
router.put('/update/:entryId', validateSession, function (req, res){

    const updateJournalEntry= {
        title: req.body.journal.title,
        date: req.body.journal.date,
        entry: req.body.journal.entry,
    };

    const query ={where: {id: req.params.entryId, owner:req.user.id}};

    Journal.update(updateJournalEntry,query)
    .then(journals => res.status(200).json(journals))
    .catch(err => res.status(500).json({error: err}))

});

//Delete---http://localhost:3000/journal/delete/2
router.delete('/delete/:id', validateSession, function(req, res){
    const query = {where: {id: req.params.id, owner: req.user.id}};

    Journal.destroy(query)
    .then(() => res.status(200).json({message: "Journal Entry Removed"}))
    .catch(err => res.status(500).json({error: err}))
})


//Get By User---http://localhost:3000/journal/mine

router.get('/mine',validateSession,(req, res)=>{
    let userid = req.user.id
    Journal.findAll({
        where:{owner: userid}
    })
    .then(journals => res.status(200).json(journals))
    .catch(err => res.status(500).json({error: err}))
});

//Get By Title- url must look lik /:title but only paste /title in postman--http://localhost:3000/journal/NumberTwo

router.get('/:title', function(req, res){
    let title= req.params.title;

    Journal.findAll({
        where:{title: title}
    })
    .then(journals => res.status(200).json(journals))
    .catch(err => res.status(500).json({error: err}))
});

router.get('/aboutTest', function(req, res)
{
    res.send('This is the about route')
});

module.exports =router