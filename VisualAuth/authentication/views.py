import cv2
from django.contrib.auth import get_user_model, login, logout, authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from face_recognition import load_image_file, face_encodings, compare_faces, face_locations

from .serializers import UserSerializer
from .models import User


class LoginView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        data = request.data
        user = authenticate(request, username=data['email'], password=data['password'])

        if user is not None:
            if not user.using_visual_authentication:
                return Response(user.create_tokens_for_user(), 200)

            return Response({"id": user.id}, 200)
        return Response({"error": 'invalid credentials'}, 400)


class VisualAuthentication(APIView):

    @staticmethod
    def face_authentication(face1, face2):
        face1_rgb = cv2.cvtColor(face1, cv2.COLOR_BGR2RGB)
        face2_rgb = cv2.cvtColor(face2, cv2.COLOR_BGR2RGB)

        located_face1 = face_locations(face1_rgb)
        located_face2 = face_locations(face2_rgb)

        face1_encodings = face_encodings(face1_rgb, located_face1)[0]
        face2_encodings = face_encodings(face2_rgb, located_face2)[0]

        return compare_faces([face1_encodings], face2_encodings)

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        face_image = request.data.get('image')

        if not user_id or face_image:
            return Response({'error': 'not enough data'}, 400)

        user = User.objects.get(id=user_id)
        face_image_from_database = cv2.imread(user.face_image.path)

        if self.face_authentication(face_image, face_image_from_database):
            login(user, request)
            return Response({'result': 'user logged in'}, 200)
        return Response({"error": "faces don't match"}, 400)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, *args, **kwargs):
        logout(request)
        return Response({'result': 'logged out'}, 200)


class RegisterView(APIView):

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, 201)


class ProfileView(APIView):

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, 200)

    def patch(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid()
        serializer.save()
        return Response(serializer.data, 200)
