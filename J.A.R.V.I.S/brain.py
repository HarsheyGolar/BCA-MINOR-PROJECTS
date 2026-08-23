import re

from langchain_core.prompts import PromptTemplate
from utils import get_key
from groq import Groq


class Jarvis:
    def __init__(self, model_name: str = "openai/gpt-oss-120b"):
        self.client = Groq(api_key=get_key("GROQ_API_KEY", aliases=["OPENAI_API_KEY"]))
        self.model_name = model_name
        self.prompt_template = PromptTemplate(
            input_variables=["context", "question"],
            template="""You are a polished AI assistant called J.A.R.V.I.S.

Follow these rules exactly:
- Write in a clean, fluent, ChatGPT-style tone.
- Keep answers concise, readable, and attractive.
- Use markdown formatting when useful: short headings, bullet points, and brief paragraphs.
- Do not use roleplay labels, system tags, or bracketed commands like [SYSTEM], [IDENTITY], [OPERATIONAL DIRECTIVE].
- Do not begin with "J.A.R.V.I.S." or "Sure" unless the user asks for a formal answer.
- If the answer is simple, keep it brief and natural.
- If the answer needs detail, use a short heading and 3-6 compact bullets or a short explanation.
- Do not output noisy filler text.

Past memory context:
{context}

User question:
{question}

Return only the final answer."""
        )

    @staticmethod
    def _clean_output(text: str) -> str:
        cleaned = text or ""
        cleaned = cleaned.replace("J.A.R.V.I.S.:", "")
        cleaned = re.sub(r"\[(?:SYSTEM|IDENTITY|OPERATIONAL|CORE|INPUT|PAST|INCOMING|COMMENCING)[^\]]*\]", "", cleaned, flags=re.IGNORECASE)
        cleaned = re.sub(r"\*\*\*+", "**", cleaned)
        cleaned = re.sub(r"\n{3,}", "\n\n", cleaned)
        cleaned = re.sub(r"\n\s*[-*]\s*\n", "\n", cleaned)
        cleaned = cleaned.strip()
        return cleaned if cleaned else "I’m ready to help. Please ask your question again."

    def generate_response(self, query: str, context: list[str] | None = None) -> str:
        try:
            context_str = "\n".join(context) if context else "No prior context available."
            prompt = self.prompt_template.format(context=context_str, question=query)

            response = self.client.chat.completions.create(
                model=self.model_name,
                messages=[
                    {"role": "system", "content": "You are a polished AI assistant. Reply clearly, naturally, and with clean markdown formatting when helpful."},
                    {"role": "user", "content": prompt},
                ],
                temperature=0.4,
                max_tokens=4096,
            )

            content = response.choices[0].message.content
            return self._clean_output(content)
        except Exception:
            return "I’m currently unable to generate a response because the AI service is temporarily unavailable. Please try again in a moment."

# if __name__=="__main__":
#     # from brain import generate_response
#     while True:
#         user_input = input("you: ")
#         if user_input.lower() == exit(1):
#             break
#         reply = generate_response(user_input)
#         print("J.A.R.V.I.S: ", reply)