import asyncio
from typing import Tuple
import google.generativeai as genai
from ollamafreeapi import OllamaFreeAPI
from groq import AsyncGroq
import config

class LLMProvider:
    def __init__(self):
        self.ollama = OllamaFreeAPI()
        self.gemini_configured = False
        self.primary_groq_key = config.GROQ_API_KEY
        self.fallback_groq_key = getattr(config, "GROQ_API_KEY_FALLBACK", None)
        self.gemini_key = config.GEMINI_API_KEY

    def _configure_gemini(self):
        if not self.gemini_configured and self.gemini_key:
            genai.configure(api_key=self.gemini_key)
            self.gemini_configured = True

    async def chat(self, prompt: str, system_prompt: str = "", model_preference: str = "ollama") -> Tuple[str, str]:
        """
        Attempts to get a response from LLM providers in order of preference.
        Defaults to OllamaFreeAPI -> Groq -> Gemini.
        """
        
        # 1. Try OllamaFreeAPI first (Free, no keys needed)
        if model_preference == "ollama":
            try:
                full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
                response = await asyncio.to_thread(self.ollama.chat, prompt=full_prompt)
                if response:
                    return response, "ollama"
            except Exception as e:
                print(f"OllamaFreeAPI failed: {e}")

        # 2. Try Groq (Fast, used in decision agent)
        # Collect unique, non-empty keys
        groq_keys = []
        if self.primary_groq_key: groq_keys.append(self.primary_groq_key)
        if self.fallback_groq_key and self.fallback_groq_key not in groq_keys:
            groq_keys.append(self.fallback_groq_key)

        for i, key in enumerate(groq_keys):
            try:
                async with AsyncGroq(api_key=key) as client:
                    messages = []
                    if system_prompt:
                        messages.append({"role": "system", "content": system_prompt})
                    messages.append({"role": "user", "content": prompt})
                    
                    completion = await client.chat.completions.create(
                        model="llama-3.3-70b-versatile",
                        messages=messages,
                        temperature=0.1
                    )
                    return completion.choices[0].message.content, "groq"
            except Exception as e:
                label = "primary" if i == 0 else "fallback"
                print(f"Groq {label} failed: {e}")
                if i < len(groq_keys) - 1:
                    print("Attempting Groq fallback...")
                    continue

        # 3. Try Gemini (Stable Backup)
        if self.gemini_key:
            try:
                self._configure_gemini()
                model = genai.GenerativeModel('gemini-1.5-flash')
                full_prompt = f"{system_prompt}\n\n{prompt}" if system_prompt else prompt
                response = await model.generate_content_async(full_prompt)
                return response.text, "gemini"
            except Exception as e:
                print(f"Gemini failed: {e}")

        raise Exception("All LLM providers failed or are unconfigured.")

llm = LLMProvider()
