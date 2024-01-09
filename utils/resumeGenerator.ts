export const generateResume = async (level: "A" | "B" | "C", jobDetails: object, path: string) => {
const PDFDocument = require('pdfkit');
const fs = require('fs');
const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(path))
  const content = await getResumeContent(jobDetails, level);
  console.log(content);
  doc
  .fontSize(15)
  .text(content, 100, 100)
  doc.end();
}

const getResumeContent = async (jobDetails: object, level: "A" | "B" | "C") => {
  const reqBody = {
    "model": "gpt-3.5-turbo",
    "messages": [
      {
        "role": "system",
        "content": "You are resume a generator."
      },
      {
        "role": "user",
        "content": `Generate a dummy ${level} level resume filling with dummy user details for job title ${jobDetails['title']} based on this job description:
        ${jobDetails['description']}
        `
      }
    ]
  };
  const response = await fetch(
    `${process.env.OPENAI_API_ENDPOINT}/chat/completions`,
    {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify(reqBody)
  });
  const resJson = await response.json();
  const content = resJson['choices'][0]['message']['content']
  return content
}