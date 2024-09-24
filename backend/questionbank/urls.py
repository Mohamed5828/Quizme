from rest_framework import routers
from questionbank.views import QuestionBankViewSet

router = routers.DefaultRouter()
router.register(r'questionbank', QuestionBankViewSet, basename='questionbank')
urlpatterns = router.urls
