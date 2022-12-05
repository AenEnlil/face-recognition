import cv2
from django.core.files.storage import default_storage
from rest_framework.exceptions import ValidationError
from rest_framework.serializers import ModelSerializer
from rest_framework import fields

from face_recognition import face_locations

from .models import User


class UserSerializer(ModelSerializer):
    password = fields.CharField(write_only=True)
    face_image = fields.ImageField(write_only=True)
    have_face_image = fields.SerializerMethodField('check_if_have_face_image')

    class Meta:
        fields = ['email', 'password', 'face_image', 'using_visual_authentication', 'have_face_image']
        model = User

    def validate_face_image(self, value):
        default_storage.save(value.name, value)
        path = default_storage.path(value.name)
        image = cv2.imread(path)

        if not face_locations(image):
            default_storage.delete(path)
            raise ValidationError("can't locate face on photo")

        default_storage.delete(path)
        return value

    def check_if_have_face_image(self, instance):
        return instance.check_if_face_image_added()

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
    
    def update(self, instance, validated_data):
        if 'face_image' in validated_data:
            instance.delete_image()
            instance.face_image = validated_data.get('face_image')
        return super(UserSerializer, self).update(instance, validated_data)
