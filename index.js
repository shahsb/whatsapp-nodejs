const bot = require('venom-bot');
const prompt = require('prompt-sync')({sigint:true});
const process = require('process');

const fs = require('fs');
const readline = require('readline');
const http = require('http')

let data = {
    contacts: [],
    message: ''
};

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

function createWaGroup(client) {

    const gname = prompt('Enter group name:');
    console.log(`Creating What's App group:[${gname}]...`);
    client.createGroup(gname, [
  	'919766524512@c.us',
  	'918007211888@c.us',
	'918806812722@c.us'
    ]).then((result) => {
                console.log('WA GROUP SUCCESS: ' + result.text);
            })
            .catch((err) => {
                console.log('WA GROUP CREATION FAILED : ' + err.text);
            });
    //console.log(`$$$ What's App group:[${gname}] created successfully...`);
}

async function readContacts() {
    return new Promise(function(resolve, reject) {
        var rd = readline.createInterface({
            input: fs.createReadStream('./contact.txt'),
            terminal: false
        });
        
        rd.on('line', function(line) {
            data.contacts.push(line);
        });

        rd.on('close', function() {
            resolve();
        });
    });
}

async function validateContacts(contacts) {
    return new Promise(function(resolve, reject) {
        //check if are 10 digits
        contacts.forEach(contact => {
            contact = contact.trim();

            if (contact.match(/[0-9]{10}/g) == null) {
                reject('Not a Valid Contact : ' + contact);
            }
        });
        
        // remove empty contacts
        data.contacts = data.contacts.filter(function(el) {
            return el.length === 10
        })
        resolve();
    });
}

async function readMessage() {
    return new Promise(function(resolve, reject) {
        try {
            const message = fs.readFileSync('./message.txt');
            data.message = message.toString();
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

async function initBot() {
    return bot.create('n1');
}

async function main() {
    try {
		
		let handleRequest = (request, response) => {
		response.writeHead(200, {
			'Content-Type': 'text/html'
		});
		fs.readFile('./index.html', null, function (error, data) {
			if (error) {
				response.writeHead(404);
				respone.write('file not found');
			} else {
				response.write(data);
			}
			response.end();
		});
	};

	http.createServer(handleRequest).listen(9001);

	/*const server = http.createServer((req, res) => {
	res.writeHead(200, { 'content-type': 'text/html' })
	fs.createReadStream('index.html').pipe(res)
	})

	server.listen(process.env.PORT || 3000)*/

	/*console.log('Hello From SBS');
        await readContacts();
        await validateContacts(data.contacts);
        await readMessage();

        const client = await initBot();

	while (true)
	{
		const choice = prompt('************\n1-Send MSG\n2-Create Group\n3-Send Contact\n4-Exit\n**********\nEnter your Choice:');
		console.log(`Your chice is ${choice}`);
		ch = Number(choice);
		switch(ch)
		{
			case 1:
				console.log('**** SENDING TEXT MESSAGE TO THE USER LIST *****');
				await sendMessages(client);
				break;
			case 2:
				console.log('****** CREATING WA GROUP *********');
				await createWaGroup(client);
				break;
			case 3:
				console.log('****** SENDING CONTACT ***********');
				// Send contact
				await client
  				.sendContactVcard('919766524512@c.us', '918806812722@c.us', 'Shakti Shah')
  				.then((result) => {
    				console.log('Result: ', result); //return object success
  				})
  				.catch((erro) => {
    				console.error('Error when sending: ', erro); //return object error
  				});
				break;
			case 4:
				console.log('***** EXITING, THANK YOU FOR USING OUR APP! *************');
				process.exit(0);
				break;
			default:
				console.log(`Enter correct choice (1 OR 2).. you entered ${ch}`);
				break;
		}
	}*/

    } catch(err) {
        console.log(err.toString());

        console.log('Press any key to exit');
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.on('data', process.exit.bind(process, 0));

    }
}

main();