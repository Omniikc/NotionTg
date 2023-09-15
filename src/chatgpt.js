import OpenAI from 'openai'
import config from 'config'
import { message } from 'telegraf/filters'

const CHATGPT_MODEL = 'gpt-3.5-turbo'
const ROLES = {
    ASSISTANT: 'assistant',
    SYSTEM: 'system',
    USER: 'user'
}

const openai = new OpenAI({
    apiKey: config.get("OPENAI_KEY")
})

const getMessage = (m) => `
    Напиши на основе этих тезисов последовательную эмоциональную историю: ${m}Б не более 2000 символов

    Эти тезесы с описание ключивых моментов дня.
    Необходимо в итоге получить краткую историю, что бы я запомнил этот день и смог в последствие пересказывать ее друзьям. 
    Много текста не нужно, главное, чтобы были эмоции, правильная последовательность + чтение контекста.
`

export async function ChatGPT(message = '') {
    const messages = [{
        role: ROLES.SYSTEM,
        content: 'Ты опытный копирайтер, который пишет краткие эмоциональные статьи для соц сетей.'
    },
    { role: ROLES.USER, content: getMessage(message) }]
    try {
        const completion = await openai.chat.completions.create({
            messages,
            model: CHATGPT_MODEL,
        })
        return completion.choices[0].message
    } catch {
        console.error('Error while chat completion', e.message);
    }
}
