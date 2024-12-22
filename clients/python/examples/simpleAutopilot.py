from spacecode import (
    Game,
    Color
)
import math
import time
import random



game = Game(host="localhost", username="Autopilot", color=Color.getRandomColor())

me = game.currentPlayer
me.x = 300
me.y = 500

while True:
    dt = time.time()*10 % 400 
    if(dt>300):
        me.moveForward()
        me.turnLeft()    
    elif (dt>200):
        me.moveForward()
        me.turnLeft()    
    elif (dt> 100):
        me.moveForward()
    else:
        me.moveBackward()
        me.turnLeft()    
    if random.randint(0, 100) > 95:
        me.shoot()
        me.turnRight()

    
    game.update()