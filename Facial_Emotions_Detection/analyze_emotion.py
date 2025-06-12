import os
import json
import cv2
import numpy as np
from keras.models import load_model
from keras.preprocessing.image import img_to_array
from collections import Counter
import sys
import warnings

# Configure output
sys.stdout.reconfigure(encoding='utf-8')
warnings.filterwarnings("ignore")
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

def load_models():
    model_path = os.path.join(os.path.dirname(__file__), 'facialemotionmodel.h5')
    face_cascade_path = os.path.join(os.path.dirname(__file__), 'haarcascade_frontalface_default.xml')
    
    if not os.path.exists(model_path) or not os.path.exists(face_cascade_path):
        print(json.dumps({"error": "Model files not found"}))
        sys.exit(1)
        
    return (
        load_model(model_path, compile=False),
        cv2.CascadeClassifier(face_cascade_path)
    )

classifier, face_classifier = load_models()
emotion_labels = ['Angry', 'Disgust', 'Fear', 'Happy', 'Neutral', 'Sad', 'Surprise']

def get_improvement_guide(emotion, confidence):
    """Provides detailed improvement suggestions for each emotion"""
    guides = {
        'Happy': {
            'description': "You appear happy and approachable",
            'strengths': ["Great for social situations", "Creates positive impressions"],
            'tips': [
                "Maintain this expression for customer interactions",
                "Slightly reduce intensity for formal settings if it appears exaggerated"
            ],
            'when_to_use': ["Team meetings", "Social gatherings", "When building rapport"]
        },
        'Neutral': {
            'description': "Your expression is neutral",
            'strengths': ["Professional appearance", "Good for formal settings"],
            'tips': [
                "Add subtle smile for warmer appearance",
                "Relax your forehead slightly to avoid looking tense",
                "Practice slight eyebrow raises to appear more engaged"
            ],
            'when_to_use': ["Job interviews", "Formal presentations", "Serious discussions"]
        },
        'Angry': {
            'description': "You appear angry or frustrated",
            'tips': [
                "Practice relaxing your jaw muscles",
                "Consciously raise your eyebrows slightly to soften expression",
                "Breathe deeply to release tension"
            ],
            'exercises': [
                "Mirror practice: Alternate between neutral and angry expressions to gain control",
                "Tension release: Squeeze facial muscles tight, then completely relax"
            ]
        },
        'Sad': {
            'description': "You appear sad or disappointed",
            'tips': [
                "Think of positive memories before important interactions",
                "Practice slight smile to lift cheek muscles",
                "Maintain gentle eye contact to avoid appearing withdrawn"
            ],
            'exercises': [
                "Smile therapy: Hold a gentle smile for 30 seconds several times daily",
                "Positive visualization before meetings"
            ]
        },
        'Surprise': {
            'description': "You appear surprised",
            'tips': [
                "Be aware of eyebrow position in professional settings",
                "Control reactions in formal situations",
                "Use this expression intentionally when appropriate"
            ],
            'when_to_use': ["When genuinely surprised", "During creative brainstorming"]
        },
        'Fear': {
            'description': "You appear fearful or anxious",
            'tips': [
                "Practice power poses before important events",
                "Focus on steady breathing to calm nerves",
                "Maintain comfortable eye contact to appear confident"
            ]
        },
        'Disgust': {
            'description': "You appear disgusted",
            'tips': [
                "Be aware of nose wrinkling in professional settings",
                "Relax your upper lip to neutralize expression",
                "Use this expression only when appropriate"
            ]
        }
    }
    
    guide = guides.get(emotion, {
        'description': "Your expression is being analyzed",
        'tips': ["Practice varying your expressions for different situations"]
    })
    
    # Add confidence-based advice
    if confidence < 0.7:
        guide['tips'].append("Your expression wasn't clearly defined - try more pronounced expressions")
    elif confidence > 0.9:
        guide['tips'].append("Your expression is very clear - consider varying intensity for different situations")
    
    return guide

def analyze_image(image_path):
    try:
        image = cv2.imread(image_path)
        if image is None:
            return {"status": "error", "message": "Unable to read image"}

        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        faces = face_classifier.detectMultiScale(gray, 1.3, 5)

        if len(faces) == 0:
            return {"status": "no_face", "message": "No face detected"}

        for (x, y, w, h) in faces:
            roi_gray = gray[y:y+h, x:x+w]
            roi_gray = cv2.resize(roi_gray, (48, 48), interpolation=cv2.INTER_AREA)
            
            if np.sum([roi_gray]) == 0:
                return {"status": "blank_face", "message": "Blank face region"}

            roi = roi_gray.astype('float') / 255.0
            roi = img_to_array(roi)
            roi = np.expand_dims(roi, axis=0)

            prediction = classifier.predict(roi, verbose=0)[0]
            emotion_idx = np.argmax(prediction)
            emotion = emotion_labels[emotion_idx]
            confidence = float(prediction[emotion_idx])
            
            return {
                "status": "success",
                "emotion": emotion,
                "confidence": confidence,
                "improvement_guide": get_improvement_guide(emotion, confidence),
                "face_position": {
                    "x": int(x),
                    "y": int(y),
                    "width": int(w),
                    "height": int(h)
                }
            }

    except Exception as e:
        return {"status": "error", "message": str(e)}

def generate_overall_insights(results):
    """Generate summary insights from all analyzed images"""
    successful = [r for r in results if r["analysis"]["status"] == "success"]
    if not successful:
        return None
    
    emotion_counts = Counter([r["analysis"]["emotion"] for r in successful])
    total = len(successful)
    dominant_emotion = emotion_counts.most_common(1)[0][0]
    
    insights = {
        "dominant_emotion": dominant_emotion,
        "emotion_distribution": dict(emotion_counts),
        "confidence_average": round(sum(
            r["analysis"].get("confidence", 0) for r in successful
        ) / total, 2)
    }
    
    # Add overall recommendations
    if insights["confidence_average"] < 0.6:
        insights["general_tip"] = "Your expressions are often ambiguous - try more defined expressions"
    elif dominant_emotion == 'Neutral' and emotion_counts['Neutral']/total > 0.8:
        insights["general_tip"] = "You maintain neutral expressions most often - practice varying your expressions"
    elif dominant_emotion in ['Angry', 'Sad'] and emotion_counts[dominant_emotion]/total > 0.5:
        insights["general_tip"] = f"You show many {dominant_emotion.lower()} expressions - try relaxation techniques"
    else:
        insights["general_tip"] = "You have good expression variety - keep practicing different emotions"
    
    return insights

def scan_directory(directory):
    extensions = ['.jpg', '.jpeg', '.png', '.bmp']
    return [
        os.path.join(root, f) 
        for root, _, files in os.walk(directory) 
        for f in files 
        if os.path.splitext(f)[1].lower() in extensions
    ]

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Directory path required"}))
        return

    directory = sys.argv[1]
    if not os.path.exists(directory):
        print(json.dumps({"error": f"Directory not found: {directory}"}))
        return

    results = []
    for img_path in scan_directory(directory):
        result = analyze_image(img_path)
        results.append({
            "file": os.path.basename(img_path),
            "analysis": result
        })

    # Generate output
    output = {
        "success": True,
        "results": results,
        "statistics": {
            "total_images": len(results),
            "successful_analyses": len([r for r in results if r["analysis"]["status"] == "success"]),
        },
        "insights": generate_overall_insights(results)
    }

    print(json.dumps(output, indent=2))

if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(json.dumps({"error": f"Unexpected error: {str(e)}"}))