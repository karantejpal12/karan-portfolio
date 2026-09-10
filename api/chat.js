export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, system } = req.body;

    // Check if API key exists
    const apiKey = process.env.REACT_APP_CLAUDE_API_KEY;
    
    console.log('API Key Status:', {
      exists: !!apiKey,
      length: apiKey ? apiKey.length : 0,
      startsWithCorrectPrefix: apiKey ? apiKey.startsWith('sk-ant-') : false
    });

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'API key not configured in environment variables',
        debug: 'REACT_APP_CLAUDE_API_KEY is missing'
      });
    }

    if (!apiKey.startsWith('sk-ant-')) {
      return res.status(500).json({ 
        error: 'API key format is invalid',
        debug: 'Key should start with sk-ant-'
      });
    }

    console.log('Calling Claude API with key:', apiKey.substring(0, 20) + '...');

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        system: system,
        messages: messages
      })
    });

    console.log('Claude API Response Status:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Claude API Error:', errorData);
      
      return res.status(response.status).json({ 
        error: errorData.error?.message || 'Claude API error',
        status: response.status,
        details: errorData.error?.type || 'unknown'
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ 
      error: 'Failed to process request',
      message: error.message,
      type: error.name
    });
  }
}
