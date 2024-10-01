from typing import Any
import numpy as np
import cv2
# Ignore "Cannot find reference" warnings
from mediapipe.python import Image, ImageFormat
from quizme.settings import MEDIAPIPE_MONITOR_OPTIONS, mp_py


class MonitorFlag:
    GOOD = "good"
    LOOKED_AWAY = "looked_away"
    ANOTHER_PERSON_DETECTED = "another_person_detected"
    NO_PERSON_DETECTED = "no_person_detected"


class DetectWrapper:
    def __init__(self, threshold_rad: float = 0.6):
        self.threshold_rad = threshold_rad
        self.detector = mp_py.vision.FaceLandmarker.create_from_options(MEDIAPIPE_MONITOR_OPTIONS)

    def __enter__(self) -> Any:
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.detector.close()

    def _detect(self, image: bytes) -> mp_py.vision.FaceLandmarkerResult:
        """
        Takes an image blob and decodes it and detects landmarks
        :param image: bytes
        :return: mp_py.vision.FaceLandmarkerResult
        """
        image = np.frombuffer(image, 'uint8')
        image = cv2.imdecode(image, cv2.IMREAD_COLOR)
        image = Image(image_format=ImageFormat.SRGB, data=image)
        return self.detector.detect(image)

    def _within_threshold(self, t: np.ndarray) -> bool:
        """
        Calculate pitch and yaw from a 3x3 or 4x4 transformation matrix
        and check if it is within the threshold
        :param t: 3x3 or 4x4 transformation matrix
        :return: bool
        """
        pitch = np.arctan2(-t[2, 0], np.sqrt(t[2, 1] ** 2 + t[2, 2] ** 2))
        yaw = np.arctan2(t[1, 0], t[0, 0])
        return abs(pitch) < self.threshold_rad and abs(yaw) < self.threshold_rad

    def categorize(self, image: bytes) -> str:
        """
        Categorize an image
        :param image: bytes
        :return: MonitorFlag enum
        """
        t_mat = self._detect(image).facial_transformation_matrixes

        if len(t_mat) == 0:
            return MonitorFlag.NO_PERSON_DETECTED
        elif len(t_mat) > 1:
            return MonitorFlag.ANOTHER_PERSON_DETECTED
        if not self._within_threshold(t_mat[0]):
            return MonitorFlag.LOOKED_AWAY

        return MonitorFlag.GOOD
