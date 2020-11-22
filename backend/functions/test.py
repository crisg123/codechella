import requests


url = 'https://us-central1-codechella-b0537.cloudfunctions.net/api/tweets'
myObj = {'key1':'key2'}

x = requests.post(url, data=myObj)
print(x.text)