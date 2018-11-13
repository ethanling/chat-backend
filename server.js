const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const Chatkit = require("@pusher/chatkit-server");

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())


const chatkit = new Chatkit.default({
	instanceLocator: "v1:us1:311aa8b8-2ce9-435a-b289-991ed13030e6",
	key: "0fef78de-bb3c-4e7c-b848-33d203c10d7d:+CNzELunh8E8V73alok5gAyBn3Rt8LPA9RgvPpCPC0g="
})

app.post('/users', (req, res) => {
	const { username } = req.body;

	chatkit.createUser({
		name: username,
		id: username
	})
	.then(() => res.sendStatus(201))
	.catch(error => {
		if(error.error === 'services/chatkit/user_already_exists') {
			res.sendStatus(200)
		} else {
			res.sendStatus(error.statusCode).json(error);
		}
	})
})

app.post('/authenticate', (req, res) => {
	// const { grant_type } = req.body;
	const authData = chatkit.authenticate({ userId: req.query.user_id });
	res.status(authData.status).send(authData.body);
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, err => {
  if (err) {
    console.error(err)
  } else {
    console.log(`Running on port ${PORT}`)
  }
})
