// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import  { ApiManager, Database } from 'lib/api-manager'

type Data = {
  name: string
}

type Error = {
	type: string;
	description: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Object>
) {
	try {
		let api = new ApiManager(req);
		let db = new Database();

		try {
			console.log(api.getUserUuid(97228554823008256));
		} catch(e) {
			console.log(e);
		}

		//let queryUser = db.query('users', {});
		
		/*let packet = {
			['name']	: 'John Doe',
			['id']	: 123456,
			['user'] : {
				['name'] : queryUser['name'],
			}
		};*/

		//data['test'] = 'test';

		Object.defineProperty(packet, 'test', {
			value: 'test prop',
			enumerable: true
		});

		res.status(200);
		res.json(packet);
	} catch(error: any) {
		if(typeof(error)==='object') {
			res.json(error);
		} /*else {
			res.write(error);
		}*/
	}
}
