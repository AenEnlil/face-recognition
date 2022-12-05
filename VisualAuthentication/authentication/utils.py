from django.core.files.images import ImageFile
from django.core.files.storage import default_storage


def convert_file_to_image(request, for_visual_auth=False):
    file = request.data.get('face_image')
    user_email = request.user.email if request.user.is_authenticated else 'None'
    image = ImageFile(file.file, name=f'{user_email}_face_image.{file.name}')
    if for_visual_auth:
        default_storage.save(image.name, image)
        return default_storage.path(image.name)
    return image
