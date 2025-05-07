
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-eazybooks-purple-dark flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-4">
          <Logo size="lg" />
          <h1 className="text-4xl font-bold tracking-tight">EazyBooks</h1>
          <p className="text-lg text-muted-foreground">
            Your modern financial co-pilot for business
          </p>
        </div>
        
        <div className="pt-4 space-y-4">
          <Button 
            onClick={() => navigate("/login")} 
            className="w-full bg-eazybooks-purple hover:bg-eazybooks-purple-secondary"
          >
            Login
          </Button>
          
          <Button 
            onClick={() => navigate("/signup")} 
            variant="outline"
            className="w-full"
          >
            Create an account
          </Button>
        </div>
        
        <p className="text-sm text-muted-foreground pt-4">
          EazyBooks offers powerful accounting tools with a clean, friendly interface
        </p>
      </div>
    </div>
  );
};

export default Index;
