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

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Object>
) {
	try {
		let api = new ApiManager(req);
		let db = new Database();
		
		let data = {
			['name']	: 'John Doe',
			['id']	: 123456
		};

		//data['test'] = 'test';

		Object.defineProperty(data, 'test', {
			value: 'test prop',
			enumerable: true
		});

		res.status(200);
		res.json(data);
	} catch(error: any) {
		if(typeof(error)==='object') {
			res.json(error);
		} /*else {
			res.write(error);
		}*/
	}
}
