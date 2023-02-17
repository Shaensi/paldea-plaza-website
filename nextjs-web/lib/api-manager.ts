import type { NextApiRequest, NextApiResponse } from 'next'
const { MongoClient, ServerApiVersion } = require('mongodb');

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Object>
 ) {
	res.status(403);
	res.json(ApiManager.errorSingle('403 FORBIDDEN',''));
	res.end();
 }
 

type Error = {
	type: string;
	description: string;
}

export type ErrorPacket = {
	error: boolean;
	errors: Error[];
}

export class ApiManager {
	private db : Database;

	private payload : any;

	public static errorMultiple(errorList: Error[]) : ErrorPacket {
		let packet : ErrorPacket = {
			error: true,
			errors: errorList
		};
		
		return packet;
	}

	public static errorSingle(type: string, description: string) {
		let packagedError : Error[] = [{
			type: type,
			description: description
		}];

		return ApiManager.errorMultiple(packagedError);
	}

	public constructor(request: NextApiRequest) {
		if(request.method === 'POST') {
			if(request.headers['content-type'] === 'application/json') {
				this.db = new Database();

				if(typeof(request.body) === 'object') {
					this.payload = request.body;
				} else if(typeof(request.body) === 'string') {
					try {
						this.payload = JSON.parse(request.body);
					} catch (e) {
						console.log(e);
						throw ApiManager.errorSingle('JSON_MALFORMED', 'Recieved data is not valid JSON');
					}
				} else {
					throw ApiManager.errorSingle('BAD_DATA_RECIEVED', 'Recieved invalid type of ['+typeof(request.body)+']');
				}
			} else {
				throw ApiManager.errorSingle('BAD_CONTENT_HEADER', '"content-type" header must be "application/json"');
			}
		} else {
			throw ApiManager.errorSingle('POST_DATA_ABSENT', 'No POST data was sent');
		}
	}

	public async getUserUuid(discordId : number) {
		//let collection = await this.db.collection('users')
		//let result = collection.findOne({ 'discord_id' : discordId});
		//let database = this.db.client();

		console.log(this.db.DATABASE_URI);

		let client = new MongoClient(this.db.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
		
		await client.connect();

		try {
			var result = await client.db('ionobot').collection('users').findOne({ 'discord_id' : discordId});

			console.log(typeof(result));
			console.log(result);
		} catch (e) {
			console.log(e);
		} finally {
			client.close();
		}

		return result;
		//return (await this.db.query('users', { 'discord_id' : discordId}));//[0]['_id'];.toArray()
	}

	public getUserDiscordId() {

	}

	public checkPayloadKey(keyName: string) : boolean {
		return this.payload.hasOwnProperty(keyName);
	}

	public getPayloadValue() {
		return this.payload.get
	}
}

export class Database {
	public DATABASE_URI: string;
	public DATABASE_NAME = 'ionobot';

	public constructor() {
		if(typeof(process.env.DATABASE_URI) === 'string') {
			this.DATABASE_URI = process.env.DATABASE_URI;
		} else {
			throw ApiManager.errorSingle('SERVER_MISCONFIGURED','Database environment variable not set');
		}
	}

	public getClient() {
		let client = new MongoClient(this.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
		return client;
	}

	public async connection() {
		try {
			var client = this.getClient();

			await client.open();

			return client.db(this.DATABASE_NAME);
		} catch(e) {
			console.log(e);
			throw(e);
		} finally {
			try {
				client.close();
			} catch {}
		}
	}

	public async collection(name: string) {
		try {
			let connection = await this.connection();

			return connection.collection(name);
		} catch (e) {
			console.log(e);
			throw(e);
		}
	}
}