module.exports = async function handler(req, res) {
  const SHEET_ID = process.env.SHEET_ID;
  const API_KEY = process.env.SHEETS_API_KEY;

  const ranges = [
    '기상!A1:J60',
    '작기정보!A1:N10',
    '포도_관수!A1:I50',
    '포도_병해!A1:J20',
    '포도_생육!A1:M50',
    '수박_관수!A1:I50',
    '수박_병해!A1:J20',
    '수박_생육!A1:M50',
    '양상추_관수!A1:I50',
    '양상추_병해!A1:J20',
    '양상추_생육!A1:M50',
    '포도_방제!A1:K20',
    '수박_방제!A1:K20',
    '양상추_방제!A1:K20',
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
