import json
from .network import sio
from .sprite import Sprite
import math



class Player:
    def __init__(self, x=0, y=0, rotation=0):
        self.__x = x
        self.__y = y
        self.__rotation = rotation
    
    def shoot(self):
        sio.emit("shoot")

    def moveForward(self):
        self.__emitKeydown("ArrowUp")

    def moveBackward(self):
        self.__emitKeydown("ArrowDown")

    def turnLeft(self):
        self.__emitKeydown("ArrowLeft")

    def turnRight(self):
        self.__emitKeydown("ArrowRight")        

    def toJSON(self):
        return self.__dict__
    
    def __emitKeydown(self, keycode):        
        sio.emit("keydown", {"keycode": keycode}, callback=lambda backendPlayer: self.__onPlayerPositionUpdated(backendPlayer))

    def __onPlayerPositionUpdated(self, backendPlayer):
        self.__x = backendPlayer["x"]
        self.__y = backendPlayer["y"]
        self.__rotation = backendPlayer["rotation"]

    def __updatePlayerProperty(self, attName, attValue):
        if not (isinstance(attValue, float) or isinstance(attValue, int)):
            raise TypeError("Expected float or int, got " + type(attValue).__name__)
        setattr(self, f"__{attName}", attValue)
        sio.emit("updatePlayerProperty", {"key": attName, "value":attValue})
    

    ############################## Getters and setters
    @property
    def x(self) -> float:
        return self.__x
    
    @x.setter
    def x(self, v: float | int):
        self.__updatePlayerProperty("x", v)

    @property
    def y(self) -> float:
        return self.__y
    
    @y.setter
    def y(self, v: float | int):
        self.__updatePlayerProperty("y", v)

    @property
    def rotation(self) -> float:
        return self.__rotation

    def turnTowards(self, sprite: Sprite) -> float:
        self.rotation = 90 + math.degrees(math.atan2(sprite.y-self.y, sprite.x-self.x))
        
    
    @rotation.setter
    def rotation(self, v: float | int):
        self.__updatePlayerProperty("rotation", v)
