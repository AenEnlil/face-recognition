from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend

UserModel = get_user_model()

class FaceRecognitionBackend(BaseBackend):
    pass