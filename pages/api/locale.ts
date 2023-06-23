import { NextApiRequest, NextApiResponse } from 'next';
import {  decodePayload } from '@lib/auth';

export default async function locale(req: NextApiRequest, res: NextApiResponse) {
    const {
        method,
				query: { context },
    } = req;

    switch (method) {
        case 'GET':
            try {
								const decoded = decodePayload(String(context));

                res.status(200).json(decoded);
            } catch (error) {
                const { message, response } = error;
                res.status(response?.status || 500).json({ message });
            }
            break;
        default:
            res.setHeader('Allow', ['GET', 'PUT']);
            res.status(405).end(`Method ${method} Not Allowed`);
    }


}
