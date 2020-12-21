import sendgrid, { send } from "@sendgrid/mail"
import { graphQLClient } from "../../utils/fauna";
import { CreateRequest } from "../../lib/Requests"

sendgrid.setApiKey(process.env.SENDGRID_API_KEY);
export default async (req, res) => {
	if (req.method != "POST") {
		res.status(400).json({
			error: "Expected POST request"
		})
		res.end()
		return
	}
	const {
		fname,
		lname,
		phone,
		email,
		description,
		street,
		city,
		postal,
		country
	} = req.body

	const query = CreateRequest
	const variables = {
		data: {
			customer: {
				firstName: fname,
				lastName: lname,
				address: {
					street,
					city,
					zipCode: postal,
					country
				},
				telephone: phone,
				email
			},
			description,
			done: false
		}
	}

	await graphQLClient.request(query, variables)
	
	const msg = {
		to: "contact@masecondecabane.com", // contact@masecondecabane.com
        from: "demandes@masecondecabane.com",
		replyTo: email,
		subject: `Nouvelle demande: ${fname} ${lname}`,
		html: `<h1>Informations de contact</h1>
        <ul>
        <li>Prénom, Nom: ${fname} ${lname}</li>
		<li>Téléphone: ${phone}</li>
		<li>Adresse: ${street}, ${city}, ${postal}, ${country}</li>
        </ul>
        <h1>Contenu</h1>
        <p>
		${description}
        </p>`
	}

	try {
		await sendgrid.send(msg);
		res.status(200).json({
			success: true
		})
	} catch (error) {
		console.error(error);

		if (error.response) {
			res.status(500).json(error.response.body)
		}
	}
}