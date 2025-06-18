import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const signUpSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis'),
  lastName: z.string().min(1, 'Le nom est requis'),
  email: z.string().email('Adresse e-mail invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

const signInSchema = z.object({
  email: z.string().email('Adresse e-mail invalide'),
  password: z.string().min(1, 'Le mot de passe est requis'),
});

const AuthPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '' },
  });

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const handleSignUp = async (values: z.infer<typeof signUpSchema>) => {
    setLoading(true);
    try {
      console.log('Tentative d\'inscription avec:', values.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            first_name: values.firstName,
            last_name: values.lastName,
          },
          emailRedirectTo: `${window.location.origin}/`,
        },
      });

      console.log('Réponse Supabase signUp:', { data, error });

      if (error) {
        console.error('Erreur d\'inscription:', error);
        
        // Gestion spécifique des différents types d'erreurs
        if (error.message.includes('User already registered')) {
          toast({ 
            title: 'Compte existant', 
            description: 'Un compte avec cet email existe déjà. Essayez de vous connecter.',
            variant: 'destructive' 
          });
        } else if (error.message.includes('Email not confirmed')) {
          toast({ 
            title: 'Email non confirmé', 
            description: 'Veuillez vérifier votre boîte email et cliquer sur le lien de confirmation.',
            variant: 'destructive' 
          });
        } else if (error.message.includes('Password should be at least')) {
          toast({ 
            title: 'Mot de passe trop faible', 
            description: 'Le mot de passe doit contenir au moins 6 caractères.',
            variant: 'destructive' 
          });
        } else if (error.message.includes('Invalid email')) {
          toast({ 
            title: 'Email invalide', 
            description: 'Veuillez saisir une adresse email valide.',
            variant: 'destructive' 
          });
        } else {
          toast({ 
            title: 'Erreur d\'inscription', 
            description: `Erreur: ${error.message}`,
            variant: 'destructive' 
          });
        }
      } else {
        // Vérifier si l'utilisateur a été créé avec succès
        if (data?.user) {
          console.log('Utilisateur créé:', data.user);
          
          // Vérifier si l'email a été confirmé automatiquement ou non
          if (data.user.email_confirmed_at) {
            toast({ 
              title: 'Inscription réussie', 
              description: 'Votre compte a été créé et confirmé avec succès !',
            });
            navigate('/');
          } else {
            toast({ 
              title: 'Vérification requise', 
              description: 'Un email de confirmation a été envoyé à votre adresse. Veuillez vérifier votre boîte email et cliquer sur le lien pour activer votre compte.',
              duration: 8000
            });
          }
        } else {
          toast({ 
            title: 'Erreur inattendue', 
            description: 'Une erreur s\'est produite lors de la création du compte.',
            variant: 'destructive' 
          });
        }
      }
    } catch (error) {
      console.error('Erreur inattendue lors de l\'inscription:', error);
      toast({ 
        title: 'Erreur', 
        description: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (values: z.infer<typeof signInSchema>) => {
    setLoading(true);
    try {
      console.log('Tentative de connexion avec:', values.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      console.log('Réponse Supabase signIn:', { data, error });

      if (error) {
        console.error('Erreur de connexion:', error);
        
        if (error.message.includes('Email not confirmed')) {
          toast({ 
            title: 'Email non confirmé', 
            description: 'Veuillez vérifier votre boîte email et cliquer sur le lien de confirmation avant de vous connecter.',
            variant: 'destructive' 
          });
        } else if (error.message.includes('Invalid login credentials')) {
          toast({ 
            title: 'Identifiants incorrects', 
            description: 'Email ou mot de passe incorrect. Veuillez vérifier vos informations.',
            variant: 'destructive' 
          });
        } else {
          toast({ 
            title: 'Erreur de connexion', 
            description: `Erreur: ${error.message}`,
            variant: 'destructive' 
          });
        }
      } else if (data?.user) {
        console.log('Connexion réussie pour:', data.user.email);
        toast({ 
          title: 'Connexion réussie', 
          description: 'Bienvenue !',
        });
        navigate('/');
      }
    } catch (error) {
      console.error('Erreur inattendue lors de la connexion:', error);
      toast({ 
        title: 'Erreur', 
        description: 'Une erreur inattendue s\'est produite. Veuillez réessayer.',
        variant: 'destructive' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <Tabs defaultValue="signin" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Se connecter ok</TabsTrigger>
          <TabsTrigger value="signup">S'inscrire</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>Se connecter</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...signInForm}>
                <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-4">
                  <FormField control={signInForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="votre@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signInForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl><Input type="password" placeholder="********" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Connexion en cours...' : 'Se connecter'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>S'inscrire</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...signUpForm}>
                <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-4">
                  <FormField control={signUpForm.control} name="firstName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prénom</FormLabel>
                      <FormControl><Input placeholder="Jean" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signUpForm.control} name="lastName" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom</FormLabel>
                      <FormControl><Input placeholder="Dupont" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signUpForm.control} name="email" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl><Input placeholder="votre@email.com" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={signUpForm.control} name="password" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mot de passe</FormLabel>
                      <FormControl><Input type="password" placeholder="********" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? 'Inscription en cours...' : 'S\'inscrire'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuthPage;
