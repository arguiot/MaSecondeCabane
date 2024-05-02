import sendgrid from "@sendgrid/mail"
import { db } from "../../db";
import { address, customer, request } from "../../db/schema";
import { sql } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";

sendgrid.setApiKey(process.env.SENDGRID_API_KEY!);
export default async (req: NextApiRequest, res: NextApiResponse) => {
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

	await db.transaction(async tx => {
		const _address = await tx.insert(address).values({
			street,
			city,
			zipCode: postal,
			country
		}).returning({ id: address._id })

		const _customer = await tx.insert(customer).values({
			firstName: fname,
			lastName: lname,
			telephone: phone,
			email,
			addressId: _address[0].id
		}).returning({ id: customer._id })

		await tx.insert(request).values({
			description,
			done: false,
			customerId: _customer[0].id
		})
	});

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
	} catch (error: any) {
		console.error(error);

		if (error.response) {
			res.status(500).json(error.response.body)
		}
	}
}