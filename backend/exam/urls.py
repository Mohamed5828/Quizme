from django.urls import path
from .views import CreateExamView,ExamQuestionsView ,UpdateExamQuestionView ,DeleteExamView


urlpatterns = [
    path('<str:exam_code>/questions/', ExamQuestionsView.as_view(), name='exam-questions'),
    path('create-exam/', CreateExamView.as_view(), name='create-exam'),
    path('<str:exam_code>/questions/<int:question_id>/', UpdateExamQuestionView.as_view(), name='update_exam_question'),
    path('<str:exam_code>/', DeleteExamView.as_view(), name='delete_exam'),
    
]
