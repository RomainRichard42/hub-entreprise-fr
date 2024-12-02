import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-float">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Info Hub France
          </h1>
          <p className="text-secondary text-lg">
            Connectez-vous pour accéder à l'application
          </p>
        </div>
        
        <div className="bg-white p-8 rounded-xl shadow-lg animate-fade-in">
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              style: {
                button: {
                  background: '#0F172A',
                  color: 'white',
                  borderRadius: '0.5rem',
                  padding: '0.75rem 1rem',
                },
                anchor: {
                  color: '#3B82F6',
                },
                container: {
                  gap: '1rem',
                },
              },
            }}
            providers={[]}
            view="sign_in"
            showLinks={false}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;