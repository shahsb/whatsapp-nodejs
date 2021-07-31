const express = require('express')
const bodyParser = require('body-parser')
const { check, validationResult } = require('express-validator')
const fs = require('fs');
const readline = require('readline');
const bot = require('venom-bot');

const app = express()
const port = 5000

let data = {
    contacts: [],
    message: ''
};

let client;

function readContacts(fileName) { 
    return new Promise(function(resolve, reject) {
		console.log('Got FileName: ' + fileName);
        var rd = readline.createInterface({
            input: fs.createReadStream(fileName),
            terminal: false
        });
        
        rd.on('line', function(line) {
            data.contacts.push(line);
			console.log('Got conatct : ' + line);
        });

        rd.on('close', function() {
            resolve();
        });
    });
}

function sendMessages(client) {
    data.contacts.forEach(function(contact) {
        client
            .sendText('91' + contact + '@c.us', data.message)
            .then((result) => {
                console.log(contact + ' : ' + result.text);
            })
            .catch((err) => {
                console.log(contact + ' : ' + err.text);
            })
    });
}

function initBot() {
    return bot.create('n1');
}

// Set Templating Enginge
app.set('view engine', 'ejs')

const urlencodedParser = bodyParser.urlencoded({ extended: false })

// Navigation
app.get('', (req, res)=> {
    res.render('index')
})

app.get('/register', (req, res)=> {
    res.render('register')
})

app.get('/signIn', (req, res)=> {
    res.render('signIn')
})

app.get('/sendMsg', (req, res)=> {
    res.render('sendMsg')
})

app.post('/register', urlencodedParser, [
    check('username', 'This username must me 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
    check('email', 'Email is not valid')
        .isEmail()
        .normalizeEmail()
], (req, res)=> {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        // return res.status(422).jsonp(errors.array())
        const alert = errors.array()
        res.render('register', {
            alert
        })
    }
})

app.post('/sendMsg', urlencodedParser, [
    check('contactsFile', 'The contacts file must be selected.')
        .exists()
        .isLength({ min: 1 }),
    check('msg', 'The Message should not be empty.')
        .exists()
        .isLength({ min: 1 })
], (req, res)=> {
	try
	{
		const errors = validationResult(req)
		if(!errors.isEmpty()) {
			// return res.status(422).jsonp(errors.array())
			const alert = errors.array()
			res.render('sendMsg', {
				alert
			})
		}
		else {
			console.log(''+ req.body.msg);
			console.log(''+ req.body.contactsFile);
			//res.json(req.body.contactsFile);
			fileName = './'+ req.body.contactsFile;
			readContacts(fileName);
			console.log('Sending Msg: ' + req.body.msg);
			console.log('SENDING MESSAGE TO ALL CONTACTS..');
			sendMessages(client);
			console.log('MESSAGE SENT SUCCESSFULLY TO ALL CONTACTS..');
			res.render('sendMsgSuccess', {})
		}
	} catch(err) {
        console.log(err.toString());

        console.log('Press any key to exit');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 0));

    }
})

app.post('/signIn', urlencodedParser, [
], (req, res)=> {
	try
	{
		const errors = validationResult(req)
		if(!errors.isEmpty()) {
			// return res.status(422).jsonp(errors.array())
			const alert = errors.array()
			res.render('signIn', {
				alert
			})
		}
		else {
			console.log('SIGNING IN');
			client = initBot();
			res.render('signInSuccess', {})
		}
	} catch(err) {
        console.log(err.toString());

        console.log('Press any key to exit');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 0));

    }
})

app.listen(port, () => console.info(`App listening on port: ${port}`))