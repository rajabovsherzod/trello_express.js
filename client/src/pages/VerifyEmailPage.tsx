import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Logo } from "@/components/shared/Logo";
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/auth/OtpInput';
import { verifyEmail } from '@/api/auth'; // API funksiyasini import qilamiz
import { userAuthStore } from '@/store/auth.store'; // Auth store'ni import qilamiz
import { getErrorMessage } from '@/utils/get-error-message';

const VerifyEmailPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const loginUserStore = userAuthStore((state) => state.login);
    
    const email = location.state?.email;
    const [otp, setOtp] = useState('');

    const { mutate: verifyMutation, isPending } = useMutation({
        mutationFn: verifyEmail,
        onSuccess: (data) => {
            toast.success("Account verified successfully! Welcome!");
            loginUserStore(data.user, data.accessToken);
            navigate('/dashboard', { replace: true });
        },
        onError: (error) => {
            toast.error("Verification Failed", {
                description: getErrorMessage(error)
            });
        }
    });

    // 6 ta raqam to'liq kiritilishi bilan avtomatik submit qilish uchun
    useEffect(() => {
        if (otp.length === 6) {
            handleVerify();
        }
    }, [otp]);

    if (!email) {
        navigate('/auth', { replace: true });
        return null;
    }
    
    const handleVerify = () => {
        if (otp.length !== 6) {
            toast.error("Please enter the complete 6-digit code.");
            return;
        }
        verifyMutation({ email, verificationCode: otp });
    };

    return (
        <div className="relative w-full h-screen">
            <BackgroundBeamsWithCollision />
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="w-full max-w-md mx-auto grid gap-6 p-6 sm:p-8 border rounded-lg bg-background/80 backdrop-blur-sm z-10">
                    <div className="grid gap-2 text-center">
                        <div className="mx-auto"><Logo /></div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Check your inbox</h1>
                        <p className="text-balance text-muted-foreground">
                            We've sent a 6-digit verification code to <br />
                            <span className="animate-shimmer bg-[linear-gradient(110deg,hsl(var(--muted-foreground)),45%,hsl(var(--primary)),55%,hsl(var(--muted-foreground)))] bg-[length:200%_100%] bg-clip-text text-transparent font-bold text-lg">
                                {email}
                            </span>
                        </p>
                    </div>

                    <div className="grid gap-4">
                        <OtpInput value={otp} onChange={setOtp} />
                        <Button onClick={handleVerify} type="submit" className="w-full" disabled={isPending}>
                            {isPending ? "Verifying..." : "Verify Account"}
                        </Button>
                    </div>

                    <p className="px-8 text-center text-sm text-muted-foreground">
                        Didn't receive the code?{' '}
                        <Button variant="link" className="p-0 h-auto" disabled={isPending}>
                            Resend
                        </Button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;