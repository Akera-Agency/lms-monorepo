import { useEffect } from "react";
import { useToast } from "@ui/hooks/use-toast";

interface ToastOptions {
    successMessage?: string | null;
    error?: string | null;
}

export function useToastNotifications({ successMessage, error }: ToastOptions) {
    const { toast } = useToast();

    useEffect(() => {
        if (successMessage) {
        toast({
            title: "Success",
            description: successMessage,
            variant: "success",
            className:
            "bg-[#ECFDF5] text-white py-4 border text-[#065F46] border border-[#10B981]",
        });
        } else if (error) {
        toast({
            title: "Error",
            description: error,
            variant: "destructive",
            className:
            "bg-[#FEE2E2] text-white py-4 border text-[#B91C1C] border border-[#EF4444]",
        });
        }
    }, [successMessage, error, toast]);
}
