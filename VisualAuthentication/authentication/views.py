import cv2
from django.core.files.storage import default_storage
from django.contrib.auth import logout, authenticate
from rest_framework.views import APIView
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import APIException

from face_recognition import face_encodings, compare_faces, face_locations

from .serializers import UserSerializer
from .models import User
from .utils import convert_file_to_image


class AuthenticationViewSet(ViewSet):
    permission_classes = (AllowAny,)

    def login(self, request, *args, **kwargs):
        data = request.data
        user = authenticate(request, username=data['email'], password=data['password'])

        if user is not None:
            if not user.using_visual_authentication:
                return Response({"redirect": False, "tokens": user.create_tokens_for_user()}, 200)

            return Response({"redirect": True, "user_id": user.id}, 200)
        return Response({"error": 'invalid credentials'}, 400)

# class LoginView(APIView):
#     permission_classes = (AllowAny,)
#
#     def post(self, request, *args, **kwargs):
#         data = request.data
#         user = authenticate(request, username=data['email'], password=data['password'])
#
#         if user is not None:
#             if not user.using_visual_authentication:
#                 return Response({"redirect": False, "tokens": user.create_tokens_for_user()}, 200)
#
#             return Response({"redirect": True, "user_id": user.id}, 200)
#         return Response({"error": 'invalid credentials'}, 400)


class VisualAuthentication(APIView):
    permission_classes = (AllowAny,)

    @staticmethod
    def clear_storage(path):
        default_storage.delete(path)
        return 'Storage cleared'

    @staticmethod
    def face_authentication(face1, face2):
        face1_rgb = cv2.cvtColor(face1, cv2.COLOR_BGR2RGB)
        face2_rgb = cv2.cvtColor(face2, cv2.COLOR_BGR2RGB)

        located_face1 = face_locations(face1_rgb)
        located_face2 = face_locations(face2_rgb)

        if not located_face1:
            raise APIException({'error': 'cant locate face on uploaded photo'})
        elif not located_face2:
            raise APIException({'error': 'cant locate face on photo from database'})

        face1_encodings = face_encodings(face1_rgb, located_face1)[0]
        face2_encodings = face_encodings(face2_rgb, located_face2)[0]

        return compare_faces([face1_encodings], face2_encodings)[-1]

    def post(self, request, *args, **kwargs):
        user_id = request.data.get('user_id')
        file = request.data.get('image')

        if not user_id or file:
            return Response({'error': 'not enough data'}, 400)

        user = User.objects.get(id=user_id)

        uploaded_image_path = convert_file_to_image(request, for_visual_auth=True)
        face_image = cv2.imread(uploaded_image_path)
        face_image_from_database = cv2.imread(user.face_image.path)

        try:
            authentication_result = self.face_authentication(face_image, face_image_from_database)
        except Exception as exc:
            self.clear_storage(uploaded_image_path)
            return Response(exc.args[-1], 400)

        if authentication_result:
            self.clear_storage(uploaded_image_path)
            return Response({"tokens": user.create_tokens_for_user()}, 200)

        self.clear_storage(uploaded_image_path)
        return Response({"error": "faces don't match"}, 400)


class LogoutView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, *args, **kwargs):
        logout(request)
        return Response({'result': 'logged out'}, 200)


class RegisterView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, 201)


class ProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, 200)

    def patch(self, request, *args, **kwargs):
        if request.query_params.get('delete_image', None) == 'True':
            self.request.user.delete_image(clear_field=True)

        if request.data.get('face_image'):
            image = convert_file_to_image(request)
            request.data.update({'face_image': image})

        serializer = UserSerializer(request.user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, 200)
