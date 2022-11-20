from rest_framework.serializers import ModelSerializer
from rest_framework import fields

from .models import User


class UserSerializer(ModelSerializer):
    password = fields.CharField(write_only=True)

    class Meta:
        fields = ['email', 'password', 'using_visual_authentication']
        model = User

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
