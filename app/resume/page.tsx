"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Github, Linkedin, Mail, Globe } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the chatbot component to avoid SSR issues
const ChatbotWidget = dynamic(() => import("@/components/chatbot-widget"), {
  ssr: false,
  loading: () => (
    <div className="fixed bottom-4 right-4 z-50">
      <Button size="icon" className="rounded-full h-12 w-12 shadow-lg">
        <MessageSquare />
      </Button>
    </div>
  ),
})

/**
 * Resume Page Component
 *
 * This component displays a professional resume with an integrated chatbot.
 * The chatbot can be toggled to provide interactive information about the resume owner.
 */
export default function ResumePage() {
  // State to control chatbot visibility
  const [chatbotOpen, setChatbotOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6">
      {/* Header section */}
      <header className="max-w-5xl mx-auto mb-12 text-center">
        <Avatar className="h-32 w-32 mx-auto mb-6 border-4 border-primary/20">
          <span className="text-4xl font-bold">JD</span>
        </Avatar>
        <h1 className="text-4xl font-bold mb-2">Jane Doe</h1>
        <p className="text-xl text-muted-foreground mb-4">Senior AI Engineer</p>
        <div className="flex justify-center gap-3 mb-6">
          <Button variant="outline" size="icon" className="rounded-full" asChild>
            <Link href="https://github.com" target="_blank">
              <Github className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" asChild>
            <Link href="https://linkedin.com" target="_blank">
              <Linkedin className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" asChild>
            <Link href="mailto:jane@example.com">
              <Mail className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" className="rounded-full" asChild>
            <Link href="https://example.com" target="_blank">
              <Globe className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge variant="secondary">Machine Learning</Badge>
          <Badge variant="secondary">Natural Language Processing</Badge>
          <Badge variant="secondary">Python</Badge>
          <Badge variant="secondary">TensorFlow</Badge>
          <Badge variant="secondary">PyTorch</Badge>
          <Badge variant="secondary">React</Badge>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-5xl mx-auto">
        <Tabs defaultValue="experience" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="education">Education</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          {/* Experience Tab */}
          <TabsContent value="experience">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Senior AI Engineer</CardTitle>
                      <CardDescription>TechCorp Inc.</CardDescription>
                    </div>
                    <Badge>2020 - Present</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>
                      Led the development of a RAG-based customer support chatbot that reduced support tickets by 35%
                    </li>
                    <li>Designed and implemented a recommendation system that increased user engagement by 28%</li>
                    <li>Mentored junior engineers and conducted technical interviews</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>Machine Learning Engineer</CardTitle>
                      <CardDescription>AI Solutions Ltd.</CardDescription>
                    </div>
                    <Badge>2018 - 2020</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Developed NLP models for sentiment analysis and text classification</li>
                    <li>Optimized model performance, reducing inference time by 40%</li>
                    <li>Collaborated with product teams to integrate ML features into the main product</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Education Tab */}
          <TabsContent value="education">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>M.S. in Computer Science</CardTitle>
                      <CardDescription>Stanford University</CardDescription>
                    </div>
                    <Badge>2016 - 2018</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>Specialization in Artificial Intelligence and Machine Learning</p>
                  <p className="mt-2">
                    Thesis: "Improving Retrieval-Augmented Generation for Domain-Specific Knowledge"
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>B.S. in Computer Science</CardTitle>
                      <CardDescription>MIT</CardDescription>
                    </div>
                    <Badge>2012 - 2016</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p>Minor in Mathematics</p>
                  <p className="mt-2">Graduated with Honors, GPA: 3.9/4.0</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gemini RAG Chatbot</CardTitle>
                  <CardDescription>A chatbot using Google's Gemini API with RAG</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Built a chatbot that uses Retrieval-Augmented Generation to provide accurate answers based on a
                    knowledge base.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline">Gemini API</Badge>
                    <Badge variant="outline">Next.js</Badge>
                    <Badge variant="outline">RAG</Badge>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="https://github.com">
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </Link>
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>AI-Powered Resume Analyzer</CardTitle>
                  <CardDescription>Resume analysis and improvement suggestions</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    Created an AI tool that analyzes resumes and provides personalized improvement suggestions based on
                    job descriptions.
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div className="flex gap-2">
                    <Badge variant="outline">NLP</Badge>
                    <Badge variant="outline">Python</Badge>
                    <Badge variant="outline">React</Badge>
                  </div>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="https://github.com">
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills">
            <Card>
              <CardHeader>
                <CardTitle>Technical Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-medium mb-3">Programming Languages</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Python</span>
                          <span>Expert</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div className="h-full bg-primary rounded-full" style={{ width: "95%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>JavaScript/TypeScript</span>
                          <span>Advanced</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div className="h-full bg-primary rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Java</span>
                          <span>Intermediate</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div className="h-full bg-primary rounded-full" style={{ width: "70%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3">Frameworks & Libraries</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>TensorFlow/PyTorch</span>
                          <span>Expert</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div className="h-full bg-primary rounded-full" style={{ width: "90%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>React/Next.js</span>
                          <span>Advanced</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div className="h-full bg-primary rounded-full" style={{ width: "80%" }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>FastAPI/Flask</span>
                          <span>Advanced</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full">
                          <div className="h-full bg-primary rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                <div>
                  <h3 className="font-medium mb-3">Other Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge>Docker</Badge>
                    <Badge>Kubernetes</Badge>
                    <Badge>AWS</Badge>
                    <Badge>GCP</Badge>
                    <Badge>CI/CD</Badge>
                    <Badge>Git</Badge>
                    <Badge>Agile</Badge>
                    <Badge>REST APIs</Badge>
                    <Badge>GraphQL</Badge>
                    <Badge>SQL</Badge>
                    <Badge>NoSQL</Badge>
                    <Badge>Data Visualization</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Chatbot toggle button */}
      <div className="fixed bottom-4 right-4 z-40">
        <Button size="icon" className="rounded-full h-12 w-12 shadow-lg" onClick={() => setChatbotOpen(!chatbotOpen)}>
          <MessageSquare />
        </Button>
      </div>

      {/* Chatbot widget */}
      {chatbotOpen && <ChatbotWidget />}
    </div>
  )
}
