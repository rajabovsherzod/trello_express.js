// client/src/pages/CompleteRegistrationPage.tsx

import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'sonner';

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Logo } from "@/components/shared/Logo";
import { CompleteRegistrationForm } from '@/components/auth/CompleteRegistrationForm';

import { completeGoogleRegistration } from '@/api/auth';
import { userAuthStore } from '@/store/auth.store';
import { getErrorMessage } from '@/utils/get-error-message';
import type { CompleteGoogleRegistrationFormValues } from '@/lib/complete-registration-validation';

interface DecodedToken {
    email: string;
    googleId: string;
    username: string;
}

const CompleteRegistrationPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const loginUserStore = userAuthStore((state) => state.login);

    const token = searchParams.get('token');
    let decodedToken: DecodedToken | null = null;
    
    try {
        if(token) decodedToken = jwtDecode<DecodedToken>(token);
    } catch (error) {
        console.error("Invalid registration token:", error);
    }

    useEffect(() => {
        if (!token || !decodedToken) {
            toast.error("Invalid or missing registration token.");
            navigate('/auth', { replace: true });
        }
    }, [token, decodedToken, navigate]);

    const { mutate: completeRegistration, isPending } = useMutation({
        mutationFn: completeGoogleRegistration,
        onSuccess: (data) => {
            toast.success("Registration complete! Welcome aboard!");
            loginUserStore(data.user, data.accessToken);
            navigate('/dashboard', { replace: true });
        },
        onError: (error) => {
            toast.error("Registration Failed", {
                description: getErrorMessage(error)
            });
        }
    });

    const handleSubmit = (values: CompleteGoogleRegistrationFormValues) => {
        if (!token) return;
        completeRegistration({ ...values, token });
    };
    
    // Agar token yaroqsiz bo'lsa, komponentni render qilmaymiz
    if (!decodedToken) {
        return null; 
    }

    return (
        <div className="relative w-full h-screen">
            <BackgroundBeamsWithCollision />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="w-full max-w-md mx-auto grid gap-6 p-6 sm:p-8 border rounded-lg bg-background/80 backdrop-blur-sm z-10">
                    <div className="grid gap-2 text-center">
                        <div className="mx-auto"><Logo /></div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Almost there!</h1>
                        <p className="text-balance text-muted-foreground">
                            Your email <span className="text-primary font-semibold">{decodedToken.email}</span> is verified.
                            Just set a username and password to complete your account.
                        </p>
                    </div>

                    <CompleteRegistrationForm 
                        onSubmit={handleSubmit}
                        isPending={isPending}
                        defaultUsername={decodedToken.username.replace(/\s/g, '').toLowerCase()}
                    />
                </div>
            </div>
        </div>
    );
};

export default CompleteRegistrationPage;