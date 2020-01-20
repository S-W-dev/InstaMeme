import os
import discord
from imagescraper import *
from dotenv import load_dotenv
load_dotenv()

token = os.getenv(TOKEN)

client = discord.Client()

@client.event
async def on_ready():
    print(f'{client.user.name} has connected to Discord!')

@client.event
async def on_message(message):
    mess = str(message.content)
    if message.author == client.user:
        return

    if ("!c" in message.content):
        m = message.content.split(', ')
        await message.channel.send("Searching for "+m[2]+"images that include '" + m[1]+"'")
        response = fetch_image_urls(m[1], int(m[2]), webdriver.Chrome(executable_path="./chromedriver.exe"))
        print(str(response))
        await message.channel.send("Found images. Sending their links now.")
        await message.channel.send(str(list(response)))

client.run(token)

#fetch_image_urls(input("Enter an image search >>> "), int(input("Enter the amount of links to fetch >>> ")), webdriver.Chrome(executable_path="./chromedriver.exe"))
#end = input("Press enter to end...")
