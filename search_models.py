import requests
from bs4 import BeautifulSoup

def search_huggingface_models(query):
    url = f"https://huggingface.co/models?search={query}"
    response = requests.get(url)
    soup = BeautifulSoup(response.text, 'html.parser')

    models = []
    for model in soup.find_all('article', class_='overview-card-wrapper'):
        name = model.find('h4').text.strip()
        link = "https://huggingface.co" + model.find('a')['href']
        models.append((name, link))

    return models

if __name__ == "__main__":
    query = "virtual try on"
    results = search_huggingface_models(query)

    print(f"Search results for '{query}':")
    for name, link in results:
        print(f"- {name}: {link}")
