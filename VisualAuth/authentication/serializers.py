from rest_framework.serializers import ModelSerializer
from rest_framework import fields

from .models import User


class UserSerializer(ModelSerializer):
    password = fields.CharField(write_only=True)
    face_image = fields.ImageField(write_only=True)
    have_face_image = fields.SerializerMethodField('check_if_have_face_image')

    class Meta:
        fields = ['email', 'password', 'face_image', 'using_visual_authentication', 'have_face_image']
        model = User

    def check_if_have_face_image(self, instance):
        return instance.face_image is not None

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
