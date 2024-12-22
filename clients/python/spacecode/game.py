
import sys
from .network import sio
import time
import json
from .player import Player
from .enemy import Enemy
from .shared_model import globals


class Game:
    def __init__(self, username, color, host="localhost", port=3000):
        url = f"http://{host}:{port}"
        print(f"Connecting to a new game on {url} with username: {username} and color: {color}" )
        self.username = username
        self.color = color
        self.currentPlayer = Player()
        self.enemies = [] 
        self.screenWidth = 400
        self.screenHeight = 400


        sio.connect(url)
        sio.emit("newPlayer", {"username": username, "color": color}, callback=lambda data: self.onInitGame(data))

        @sio.on('updateEnemies')
        def onUpdateEnemies(enemies):
            self.enemies = list(map( lambda e: Enemy(e), enemies.values()))
        
        """
        @sio.on('updatePlayers')
        def onUpdatePlayer(players):
            backendMe = players[sio.get_sid()]
            self.currentPlayer.__x = backendMe["x"]
            self.currentPlayer.__y = backendMe["y"]
            print(f"me.x : {self.currentPlayer.__x} ")
            print(f"me.y : {self.currentPlayer.__y} ")
            print(f"me.rotation : {self.currentPlayer.__rotation} ")
            self.currentPlayer.__rotation = backendMe["rotation"]
        """

    def onInitGame(self, data):
        globals.screenWidth = data["width"]
        globals.screenHeight = data["height"]
        self.screenWidth = globals.screenWidth
        self.screenHeight = globals.screenHeight

    def update(self):
        time.sleep(1/20)

