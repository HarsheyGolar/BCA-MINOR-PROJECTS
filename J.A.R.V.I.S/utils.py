from dotenv import load_dotenv
import os

load_dotenv()


def get_key(key_name, aliases=None):
    aliases = [key_name, *(aliases or [])]

    for name in aliases:
        value = os.getenv(name)
        if value and value.strip():
            return value.strip()

    keys = ", ".join(aliases)
    raise RuntimeError(f"Missing API key. Set one of: {keys}")


if __name__ == "__main__":
    result = get_key("GROQ_API_KEY", aliases=["OPENAI_API_KEY"])
    print(f"[+] key found successfully: {result[:5]}.....[Hidden]")
