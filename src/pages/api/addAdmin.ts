import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = await db.connect();

    try {
        if (req.method === 'POST') {
            const { username, password, name } = req.body;
            console.log(username, password, name, '!');
            const existingUser = await client.query('SELECT * FROM adminuser WHERE userid = $1', [username]);
            if (existingUser.rows.length > 0) {
                return res.status(200).json(false);
            }

            await client.query('INSERT INTO adminuser (userid, password,name,grade) VALUES ($1, $2,$3,$4)', [
                username,
                password,
                name,
                0,
            ]);

            return res.status(200).json(true);
        } else {
            return res.status(405).json({ error: 'Only POST requests allowed' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
}
