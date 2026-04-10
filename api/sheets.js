export default async function handler(req, res) {
  const SHEET_ID = process.env.SHEET_ID;
  const API_KEY = process.env.SHEETS_API_KEY;

  const ranges = [
    '기상!A1:I30',
    '작기정보!A1:N5',
    '포도_관수!A1:I20',
    '포도_병해!A1:J10',
  ];

  try {
    const results = {};

    for (const range of ranges) {
      const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent(range)}?key=${API_KEY}`;
      const response = await fetch(url);
      const data = await response.json();
      const sheetName = range.split('!')[0];
      results[sheetName] = data.values || [];
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(results);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
