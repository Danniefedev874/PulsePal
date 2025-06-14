import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Check for the request method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Example: Check for an authentication token in the headers
  const token = req.headers['authorization'];

  if (!token || token !== 'your-secret-token') {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // If authentication is successful
  res.status(200).json({ message: 'API is working!' });
}
