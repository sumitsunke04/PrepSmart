"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/utils/db";
import { chatSession } from "@/utils/geminiAiModel";
import { MockInterview } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { LoaderCircle, Rocket, Sparkles } from "lucide-react";
import moment from "moment";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid';
import { motion } from "framer-motion";

const AddNewInterview = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [noOfQuestions, setNoOfQuestions] = useState(3);
  const [jobExperience, setJobExperience] = useState(0);
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState('');
  const user = useUser();
  const router = useRouter();

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setLoading(true);

    try {
      const inputPrompt = `Job position: ${jobPosition} Job description: ${jobDescription} Job experience: ${jobExperience} years, Using this information give us ${noOfQuestions} interview questions along with answer text and return the result in JSON format. This json format has key value pair value should be a single string. Also, make sure it will parse easily in JSON. And give response as array of object as each object has keys questions, answers and other if needed, please check on your side that it easily parsed`;

      const result = await chatSession.sendMessage(inputPrompt);
      const mockJsonResponse = result.response.text().replace(/```json|```/g, '').trim();

      try {
        const parsedResponse = JSON.parse(mockJsonResponse);
        console.log("Parsed Response:", parsedResponse);
        setJsonResponse(mockJsonResponse);

        if (mockJsonResponse) {
          const response = await db.insert(MockInterview).values({
            mockId: uuidv4(),
            noOfQuestions: noOfQuestions,
            jobPosition: jobPosition,
            jobDesc: jobDescription,
            jobExperience: jobExperience,
            jsonMockResp: mockJsonResponse,
            createdBy: user?.user?.primaryEmailAddress?.emailAddress,
            createdAt: moment().format('DD-MM-yyyy'),
          }).returning({ mockId: MockInterview.mockId });

          router.push(`/dashboard/interview/${response[0].mockId}`);
        }
      } catch (parseError) {
        console.error("Failed to parse JSON:", parseError);
        throw new Error("Failed to parse the response as JSON.");
      }
    } catch (error) {
      console.error("Error during onSubmit:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center p-8 rounded-lg cursor-pointer bg-gradient-to-br from-[#111233] to-[#1E1B4B] border border-blue-500/30 hover:border-blue-500/60 transition-all shadow-lg hover:shadow-blue-500/20"
          >
            <div className="text-center">
              <div className="flex justify-center mb-3">
                <div className="p-3 rounded-full bg-blue-500/10">
                  <Rocket className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white mb-1">New Interview</h3>
              <p className="text-sm text-gray-400">Start practicing with AI</p>
            </div>
          </motion.div>
        </DialogTrigger>

        <DialogContent className="bg-[#100D28] max-w-2xl border border-blue-500/30 rounded-xl overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative"
          >
            {/* Gradient background elements */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full filter blur-3xl opacity-10" />
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500 rounded-full filter blur-3xl opacity-10" />

            <DialogHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <DialogTitle className="font-bold text-2xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Create New Interview
                </DialogTitle>
              </div>
              
              <form onSubmit={onSubmit}>
                <div className="space-y-6">
                  <div className="text-sm">
                    <p className="text-gray-300 mb-6">
                      Provide details about the position you're preparing for to get personalized interview questions.
                    </p>
                    
                    <div className="space-y-5">
                      <div>
                        <Label className="block text-sm font-medium text-gray-300 mb-2">
                          Job Role/Position
                        </Label>
                        <Input 
                          className="bg-[#111233] border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                          onChange={(ev) => setJobPosition(ev.target.value)} 
                          placeholder="E.g. Senior Frontend Developer" 
                          required 
                        />
                      </div>
                      
                      <div>
                        <Label className="block text-sm font-medium text-gray-300 mb-2">
                          Job Description & Tech Stack
                        </Label>
                        <Textarea 
                          className="bg-[#111233] border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                          onChange={(ev) => setJobDescription(ev.target.value)} 
                          placeholder="E.g. React, TypeScript, Redux, GraphQL, AWS"
                          required 
                        />
                        <p className="text-xs text-gray-500 mt-1">Briefly describe the role and required technologies</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="block text-sm font-medium text-gray-300 mb-2">
                            Years of Experience
                          </Label>
                          <Input 
                            className="bg-[#111233] border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                            onChange={(ev) => setJobExperience(ev.target.value)} 
                            placeholder="E.g. 5" 
                            type="number" 
                            required 
                            min="0"
                            max="75"
                          />
                        </div>
                        
                        <div>
                          <Label className="block text-sm font-medium text-gray-300 mb-2">
                            Number of Questions
                          </Label>
                          <Input 
                            className="bg-[#111233] no-arrows border-gray-700 text-white focus:border-blue-500 focus:ring-blue-500"
                            value={noOfQuestions}
                            onChange={(ev) => setNoOfQuestions(ev.target.value)}
                            type="number"
                            required
                            min="0"
                            max="50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                      <Button 
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white shadow-lg shadow-blue-500/20"
                        type="submit" 
                        disabled={loading}
                      >
                        {loading ? (
                          <span className="flex items-center gap-2">
                            <LoaderCircle className="animate-spin w-4 h-4" />
                            Generating Questions...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Rocket className="w-4 h-4" />
                            Start Mock Interview
                          </span>
                        )}
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </form>
            </DialogHeader>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddNewInterview;