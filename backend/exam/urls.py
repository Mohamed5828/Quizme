from django.urls import path
from .views import CreateExamView,ExamQuestionsView ,UpdateExamQuestionView ,DeleteExamView ,ListExamsView ,CodeExecutionView

from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
    openapi.Info(
        title="Exam App API",
        default_version='v1',
        description="API for managing exams and questions",
        contact=openapi.Contact(email="khaled.hamouda.elsayed@gmail.com"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)



urlpatterns = [
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('<str:exam_code>/questions/', ExamQuestionsView.as_view(), name='exam-questions'),
    path('create-exam/', CreateExamView.as_view(), name='create-exam'),
    path('<str:exam_code>/questions/<int:question_id>/', UpdateExamQuestionView.as_view(), name='update_exam_question'),
    path('<str:exam_code>/', DeleteExamView.as_view(), name='delete_exam'),
    path('list/', ListExamsView.as_view(), name='list-exams'),
    path('execute-code/', CodeExecutionView.as_view(), name='execute-code'),

]
