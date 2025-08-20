import { cn } from "../../../../packages/ui/src/lib/utils"
import { Button } from "../../../../packages/ui/src/components/shadcn/button"
import  Input  from "../../../../packages/ui/src/components/form/input"
import type React from "react"

interface AuthFormProps {
    title: string,
    subtitle: string,
    forgotPassword: boolean,
    submitText: string,
    footerQuestion: string,
    footerLinkHref: string,
    footerLinkText: string,
    error: string | null,
    isLoading: boolean,
    loadingText: string,
    handleAuth: (e: React.FormEvent<HTMLFormElement>) => void,
    handleInputChange?: (e: React.ChangeEvent<HTMLInputElement> & React.FormEvent<HTMLLabelElement>) => void,
}

export function AuthForm({
    className,
    title,
    subtitle,
    forgotPassword,
    submitText,
    footerQuestion,
    footerLinkHref,
    footerLinkText,
    error,
    isLoading,
    loadingText,
    handleAuth,
    handleInputChange,
    ...props
}: React.ComponentProps<"form"> & AuthFormProps) {
    return (
        <form onSubmit={handleAuth} className={cn("flex flex-col gap-10", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">{title}</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    {subtitle}
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Input 
                    id="email"
                    type="email" 
                    placeholder="m@example.com" 
                    label="Email" 
                    labelClassName="text-white"
                    onChange={handleInputChange}/>
                </div>
                <div className="grid gap-3">
                    <Input 
                    id="password" 
                    type="password" 
                    label="Password" 
                    labelClassName="text-white"
                    onChange={handleInputChange}/>
                    {forgotPassword && (
                    <div className="flex items-center">
                        <a
                        href="#"
                        className="ml-auto text-sm underline-offset-4 hover:underline"
                        >
                        Forgot your password?
                        </a>
                    </div>)}
                </div>
                <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? `${loadingText}` :`${submitText}`}
                
                </Button> 
                {error && (
                <p className="text-red-500 text-sm text-center -mt-2 -mb-2">
                    {error}
                </p>
                )}       
            </div>
            <div className="text-center text-sm">
                {footerQuestion}{" "}
                <a href={footerLinkHref} className="underline underline-offset-4">
                {footerLinkText}
                </a>
            </div>
        </form>
    )
}
