import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  try {
    const response = await fetch(`http://localhost:3001/api/experiences/${id}`);
    const data = await response.json();

    // Set caching headers
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    
    if (!response.ok) {
      throw new Error('Experience not found');
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(error.status || 500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
} 