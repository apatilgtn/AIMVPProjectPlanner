import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserCheck, UserPlus, Loader2 } from "lucide-react";
import logoImage from "../assets/logo.png";

// Form validation schema
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

// API helpers
async function loginUser(credentials: z.infer<typeof loginSchema>) {
  const response = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login failed");
  }

  return response.json();
}

async function registerUser(credentials: z.infer<typeof loginSchema>) {
  const response = await fetch("/api/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Registration failed");
  }

  return response.json();
}

async function checkAuthStatus() {
  const response = await fetch("/api/user");
  if (!response.ok) {
    if (response.status === 401) {
      return null; // Not authenticated
    }
    throw new Error("Failed to check authentication status");
  }
  
  return response.json();
}

const AuthPage: React.FC = () => {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = await checkAuthStatus();
        if (authData && authData.success) {
          setIsAuthenticated(true);
          // Redirect to home page if already logged in
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      }
    };

    checkAuth();
  }, [navigate]);

  const onLoginSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const response = await loginUser(data);
      if (response.success) {
        toast({
          title: "Login successful",
          description: `Welcome, ${data.username}!`,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid username or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onRegisterSubmit = async (data: z.infer<typeof loginSchema>) => {
    setIsLoading(true);
    try {
      const response = await registerUser(data);
      if (response.success) {
        toast({
          title: "Registration successful",
          description: `Welcome, ${data.username}!`,
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If already authenticated, don't show the login page
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="container flex flex-col items-center justify-center min-h-screen py-2">
      <div className="grid w-full gap-8 lg:grid-cols-2 max-w-5xl">
        <div className="flex flex-col justify-center">
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <img src={logoImage} alt="MVP Assistant Logo" className="h-12 w-12 mr-3" />
              <h1 className="text-4xl font-bold tracking-tight">
                MVP Planning Assistant
              </h1>
            </div>
            <p className="mt-4 text-lg text-slate-600">
              Transform your entrepreneurial ideas into structured roadmaps with intelligent AI guidance.
            </p>
          </div>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Please sign in to continue using the MVP Planning Assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'login' | 'register')}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login" className="flex items-center">
                    <UserCheck className="h-4 w-4 mr-2" />
                    Login
                  </TabsTrigger>
                  <TabsTrigger value="register" className="flex items-center">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Register
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="admin" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                          </>
                        ) : (
                          "Sign In"
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
                
                <TabsContent value="register">
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Username</FormLabel>
                            <FormControl>
                              <Input placeholder="Choose a username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="Choose a password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    </form>
                  </Form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-center border-t p-4">
              <p className="text-sm text-slate-500 text-center">
                Default username: <strong>admin</strong>, password: <strong>admin</strong>
              </p>
            </CardFooter>
          </Card>
        </div>

        <div className="hidden lg:flex flex-col justify-center p-6 bg-slate-50 rounded-lg border border-slate-200">
          <div className="mx-auto max-w-md space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                AI-Powered MVP Planning
              </h2>
              <p className="mt-2 text-slate-600">
                Build your MVP plans with AI-assisted guidance, complete with features, milestones, and KPIs.
              </p>
            </div>
            
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <h3 className="font-medium mb-2">Planning Made Simple</h3>
              <p className="text-sm text-slate-600">
                Provide basic details about your project and let AI generate comprehensive plans in seconds.
              </p>
            </div>
            
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <h3 className="font-medium mb-2">Visualize Your Product</h3>
              <p className="text-sm text-slate-600">
                Generate flow diagrams to visualize user journeys, data flow, and system architecture.
              </p>
            </div>
            
            <div className="border border-slate-200 rounded-lg p-4 bg-white">
              <h3 className="font-medium mb-2">Export & Share</h3>
              <p className="text-sm text-slate-600">
                Export your MVP plans as PDF, Markdown, or DOCX for easy sharing with stakeholders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;