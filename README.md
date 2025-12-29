# Skin-vestigator: A Common Skin Disease Detector 

Skin is one of the most important and considered as the largest part of a human’s body. Since it is a body part that is exposed, it is expected to be extra taken care of. Computer vision has revolutionized healthcare by enabling automated, fast, and accurate diagnosis of medical conditions through image analysis. This project uses computer vision to detect common skin diseases from images using RF-DETR (Roboflow Detection Transformer) by Roboflow. Addressing skin disease detection is important as early and accurate diagnosis can prevent complications and improve treatment outcomes.

# Problem

Skin diseases often require expert examination for diagnosis, which is not always accessible, especially in remote areas. This project aims to develop an automated detector that identifies common skin diseases from images, providing quicker and more accessible diagnosis. Solving this problem can reduce diagnostic delays and healthcare burdens.

# Objectives

- To develop an object detection model for detecting multiple common skin diseases in real-time.
- To achieve a detection accuracy of at least 85% on a validated test dataset.
- To create a user-friendly interface for uploading and analyzing skin images.

# Background 

In a study conducted by Inthiyaz (2022), a CNN approach model for skin disease detection was proposed and it achieved a good result with 87% accuracy that is effective for its purpose. Prior research in skin disease detection has utilized CNN-based models with notable success, yet many lack multiple detection in a single model. Existing detectors often focus on single diseases or require complex preprocessing. Various studies also utilize transformer-based object detection models for detecting skin diseases. The study conducted by Ren et al. (2025) proposed an improved RT-DETR model for skin disease detection and to solve the problem regarding the image noise interference that affects the accuracy of the detection tasks. The result of their study improves this kind of task by effectively extracting and integrating multi-scale features.

# Methodology 

The project uses RF-DETR for object detection, utilizing its speed and accuracy for real-time upload performance. Image preprocessing, augmentation, and annotation will be performed to prepare the dataset. Training and testing will use Python, OpenCV for image handling, and Colab. Datasets available on Roboflow or Kaggle will provide annotated images of common skin diseases.

# Project Scope

The project focuses on detecting a predefined set of common skin diseases (chicken skin, pimple etc.) from images taken in controlled environments. It does not do diagnosis through other medical data or unstructured clinical images. 

# Feasibility and Risks
Technical risks include insufficient data quality or quantity and model overfitting. Resource constraints such as GPU availability might affect training speed. Mitigations include data augmentation, transfer learning, and cloud computing resources.

# Resources Required
- Hardware: Google Colab.
- Software: Python, OpenCV, annotation tools.
- Datasets: Roboflow or Kaggle skin disease datasets.


## Contributors’ GitHub Profile Links:

- (https://github.com/alyssanew)
- [@jeysiiiiiii] (add-your-link)
- [@ackleely](https://github.com/yourusername)
