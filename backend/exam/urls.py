from django.urls import path
from .views import CreateExamView,ExamQuestionsView


urlpatterns = [
    path('<str:exam_code>/questions/', ExamQuestionsView.as_view(), name='exam-questions'),
    path('create-exam/', CreateExamView.as_view(), name='create-exam'),
]
