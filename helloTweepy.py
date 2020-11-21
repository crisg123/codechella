import tweepy
import wget
import base64
import requests

auth = tweepy.OAuthHandler("sZ6tAowV11qMoX09iPg0wIaOG", "ojppuK9SjKpO4zNALC0i3WgZJZjauiDL6z3l83NthRbM2WovIf")
auth.set_access_token("1888484838-eMcre7hbsacQWNF2CAadXsr1TVUDV6aOEQvY5Cs",
                      "5R5i4hLTgDPeoIvAk2AJ5061aVM7Fp0g7UfwpwiBLPzZl")

api = tweepy.API(auth)


def identify_plant(file_names):
    images = encode_files(file_names)

    # see the docs for more optional attributes
    params = {
        "api_key": "PT2LRnZuDENCCzD6Vl8u3V4FboW01gk9XAzuNpC7WoIPmybWe6",
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
        if len(media) > 0:
            media_files.add(media[0]['media_url'])
        for media_file in media_files:
            wget.download(media_file)
            name = media_file.split("/")[-1]
            files = [name]
            print(name)
            tweet = identify_plant(files)



GEOBOX_YELLOWSTONE = [-114.3918577631, 35.2967854734, -103.74610581, 45.6655362056]
GEOBOX_GREAT_SMOKY_MOUNTAIN = [-83.5644178449, 35.5573063495, -83.4257154523, 35.6457970655]
GEOBOX_GERMANY = [5.0770049095, 47.2982950435, 15.0403900146, 54.9039819757]

sapi = tweepy.streaming.Stream(auth, MyStreamListener())
sapi.filter(track=["#plant", "#plants", "#tree", "#trees", "#flower", "#flowers", "#Gardening", "#nature"])