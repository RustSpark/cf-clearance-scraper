import asyncio
import random
import string

import requests
from curl_cffi import requests as curl_requests


# from curl_cffi.requests import AsyncSession
# from loguru import logger
def generate_random_string(length=15):
    # 字符集包括字母和数字
    characters = string.ascii_letters + string.digits
    # 使用 random.choices 从字符集中随机选择字符
    random_string = "".join(random.choices(characters, k=length))
    return random_string



cf = requests.post(
    "http://localhost:3000/scraper",
    json={
        "url": "https://listing-api.openloot.com/v2/market/rentals?page=2&q=Resounding&sort=price:asc&priceTo=500",
        "mode": "cloudflare",
        "proxy": {

        },
        "authToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3M2VjMGUxNWY1ZjQ3MWIyMmVhMjlmNyIsIm5iZiI6MTczMjc2MzM1NSwidXNlcm5hbWUiOiJhZG1pbiJ9.M9ZqSRUIXTafnkqgI40zh8Ig77ARetgveDYKpqfD_wQ",
    },
    headers={
        "Content-Type": "application/json",
    },
    timeout=120
)
print(cf.text)
result = cf.json()


def run_sync(num: int):
    response = curl_requests.get(
        f"https://listing-api.openloot.com/v2/market/rentals?page={num}&q=Resounding&sort=price:asc&priceTo=500",
        headers=result["headers"],
        cookies={item["name"]: item["value"] for item in result["cookies"]},
    )
    print(response.json())


if __name__ == "__main__":
    # asyncio.run(run_async(6))
    run_sync(5)
