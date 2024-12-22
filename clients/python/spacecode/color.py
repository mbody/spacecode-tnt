import random


class Color: 
    @staticmethod
    def getRandomColor():
        return f"hsl({random.randint(0, 360)}, 100%, 50%)"
