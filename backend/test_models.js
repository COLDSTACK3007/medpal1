const { GoogleGenAI } = require('@google/genai');
const ai = new GoogleGenAI({ apiKey: 'REDACTED_API_KEY_ROTATE_ME' });
async function run() {
  const models = await ai.models.list();
  for await (const m of models) {
    console.log(m.name);
  }
}
run().catch(console.error);
