import { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@vercel/postgres';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = await db.connect();

    try {
        // 요청 메서드 확인
        console.log('Request Method:', req.method);

        if (req.method === 'POST') {
            const { username, password, name } = req.body;
            console.log(username, password, name, '!');

            // 이미 존재하는 사용자 확인
            const existingUser = await client.query('SELECT * FROM adminuser WHERE userid = $1', [username]);
            if (existingUser.rows.length > 0) {
                return res.status(200).json(false); // 이미 존재하는 사용자
            }

            // 새로운 관리자 추가
            await client.query('INSERT INTO adminuser (userid, password, name, grade) VALUES ($1, $2, $3, $4)', [
                username,
                password,
                name,
                0,
            ]);

            return res.status(200).json(true); // 관리자 추가 성공
        } else {
            // POST 외의 요청 처리
            return res.status(405).json({ error: 'Only POST requests allowed' });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        client.release();
    }
}
