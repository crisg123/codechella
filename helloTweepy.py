import tweepy
import wget
import base64
import requests
import config

consumer_key = config.api_key 
consumer_secret = config.api_secret
access_token = config.access_token 
access_token_secret = config.token_secret 
plant_api_key = config.plant_api_key

auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token,access_token_secret)

api = tweepy.API(auth)


def identify_plant(file_names):
    images = encode_files(file_names)

    # see the docs for more optional attributes
    params = {
        "api_key": plant_api_key,
        "images": images,
        "modifiers": ["crops_fast", "similar_images"],
        "plant_language": "en",
        "plant_details": ["common_names",
                          "url",
                          "name_authority",
                          "wiki_description",
                          "taxonomy",
                          "synonyms"],
    }

    headers = {
        "Content-Type": "application/json"
    }

    response = requests.post("https://api.plant.id/v2/identify",
                             json=params,
                             headers=headers)
    y = response.json()
    str = ""
    plant_name = y["suggestions"][0]["plant_name"]
    stats = y["suggestions"][0]["probability"]
    str = "With " + format((float(stats) * 100), '.2f') + "% probablity, the plant in the picture is " + plant_name
    return str


def encode_files(file_names):
    files_encoded = []
    for file_name in file_names:
        with open(file_name, "rb") as file:
            files_encoded.append(base64.b64encode(file.read()).decode("ascii"))
    return files_encoded


class MyStreamListener(tweepy.StreamListener):

    def on_status(self, status):
        media_files = set()
        media = status.entities.get('media', [])
        id = status.id
        screenName = status.user.screen_name
        if len(media) > 0:
            media_files.add(media[0]['media_url'])
        print(media_files)
        for media_file in media_files:
            wget.download(media_file)
            name = media_file.split("/")[-1]
            files = [name]
            tweet = "@" + screenName + " " + identify_plant(files)
            api.update_status(status=tweet, in_reply_to_status_id=id)

sapi = tweepy.streaming.Stream(auth, MyStreamListener())
sapi.filter(track=["#RandomPlantThings"])
