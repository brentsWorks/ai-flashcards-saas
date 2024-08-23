import { NextResponse } from 'next/server'
import OpenAI from 'openai'

require('dotenv').config({ path: '.env.local' })

const systemPrompt = `
You are a flashcard creator, your task is to take in text and generate effective, concise flashcards based on the given topics in the text. Make sure to create exactly 10 flashcards.
Both front and back should be one sentence long.

1. Create clear and concise questions for the front of the flashcard.
2. Provide accurate and informative answers for the back of each flashcard.
3. Ensure that each flashcard focuses on a single concept or piece of information.
4. Use simple language to mkae the flashcards accessible to a wide range of learners.
5. Include a variety of question types, such as definitions, examples, comparions, and applications.
6. Avoid overly complex or ambiguous phrasing in both questions and answers. 
7. When appropriate, use mnemonics or memory aids to help reinforce the information.
8. Tailor the difficulty level of the flashcards to the user's specified preferences.
9. If given a body of text, extract the most important and relevant information for the flashcards.
10. Aim to create a balanced set of flashcards that covers the topic comprehensively.
11. Only generate 10 flashcards. 

Remember that the goal is to facilitate effective learning and retention of information through these flashcards.

You should return in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`
const openai = new OpenAI({
	baseURL: "https://openrouter.ai/api/v1",
	apiKey: process.env.OPENROUTER_API_KEY,
})

export async function POST(req) {
	
	
	const data = await req.text()
	const completion = await openai.chat.completions.create({
		messages: [
		  { role: 'system', content: systemPrompt },
		  { role: 'user', content: data },
		],
		model: 'meta-llama/llama-3.1-8b-instruct:free',
		response_format: { type: 'json_object' },
	})
	// Parse the JSON response from the OpenAI API
	const content = completion.choices[0].message.content
	const start = content.indexOf('{');
    const end = content.lastIndexOf('}') + 1;
    // Extract the JSON part
    const jsonPart = content.slice(start, end);
	const flashcards = JSON.parse(jsonPart)
	// Return the flashcards as a JSON response
	console.log(flashcards)
	
	return NextResponse.json(flashcards.flashcards)
  }