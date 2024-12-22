from spacecode import (
    Game,
    Color
)
import math
import time
import random


# Connect to a new game, with your name and the color of your player
game = Game(host="localhost", username="Tracker", color=Color.getRandomColor())

# Get your player instance
me = game.currentPlayer

# Loop for ever
while True:
   
    # if the list of enemies is not empty
    if len(game.enemies) > 0:
        
        # then turn to in the direction of the first one 
        me.turnTowards(game.enemies[0])
        
        # move foward
        me.moveForward()

        # shoot !
        me.shoot()

    else :
        # else, simply turn right
        me.turnRight()
    
    # Must be called at the end of each loop for the game to update
    game.update()