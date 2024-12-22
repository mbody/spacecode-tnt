class Sprite :
    def __init__(self, data):
        self.x = data["x"] 
        self.y = data["y"] 
        self.__dict__ = data

