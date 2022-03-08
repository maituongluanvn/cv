// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

// type Data = {
//   name: string;
// };

export default function handler(req: NextApiRequest, res: NextApiResponse<any>) {
  const md = fs.readFileSync(`${process.cwd()}/src/index.md`);
  res.setHeader('Content-Type', 'application/json');
  // res.setHeader('Content-Length', 1000);
  res.status(200).send({ name: 'abc' });
}
