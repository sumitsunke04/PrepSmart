import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react'

const QustionsSection = ({ mockInterviewQuestion, activeQuestionIndex }) => {
    const questions = mockInterviewQuestion ;
    console.log("QuestionsM:", mockInterviewQuestion);

    const textToSpeech = (text)=>{
        if('speechSynthesis' in window){
            const speech = new SpeechSynthesisUtterance(text);
            window.speechSynthesis.speak(speech);
        }else{
            alert("Sorry your browser does not support speech synthesis");
        }
    }

    return (
        <div className='mt-10 p-5 border rounded-lg'>
            <div>
                <h2 className=' my-5 text-md md:text-lg'>{questions[activeQuestionIndex]?.question}</h2>
                <Volume2 className=' cursor-pointer' onClick={()=>textToSpeech(questions[activeQuestionIndex]?.question)}/>
            </div>

            <div className='border rounded-lg p-5 bg-gray-100 mt-20'>
                <h2 className='flex gap-2 items-center text-orange-700'>
                    <Lightbulb/>
                    <strong>Note: </strong>
                </h2>
                <h2 className='text-orange-700 my-2'>{process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_NOTE}</h2>
            </div>
        </div>
    );
};
export default QustionsSection