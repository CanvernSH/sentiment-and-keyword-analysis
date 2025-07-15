import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { inputs } = await req.json();

    if (!inputs || typeof inputs !== 'string') {
      return NextResponse.json({ error: 'Invalid inputs' }, { status: 400 });
    }

    const responseA = fetch('https://api-inference.huggingface.co/models/distilbert/distilbert-base-uncased-finetuned-sst-2-english', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs }),
    });

    const responseB = fetch('https://api-inference.huggingface.co/models/dbmdz/bert-large-cased-finetuned-conll03-english', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs }),
    });

    const [response1, response2] = await Promise.all([responseA, responseB]);

    if (!response1.ok || !response2.ok) {
      //const errorText = await response.text();
      const sentimentError = !response1.ok ? await response1.text() : '';
      const keywordsError = !response2.ok ? await response2.text() : '';
      return NextResponse.json({
        error: `Model error(s): ${sentimentError} ${keywordsError}`.trim(),
      }, {status: 500 });
    }

    const sentimentData = await response1.json();
    const keywordsData = await response2.json();

    return NextResponse.json({ 
      sentiment: sentimentData,
      keywords: keywordsData,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'Error' }, { status: 500 });

  }
}
