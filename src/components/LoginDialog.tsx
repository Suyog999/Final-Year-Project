'use client'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/login-form"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import '../../src/app/globals.css'
import { useState } from "react"

interface LoginDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = open !== undefined && onOpenChange !== undefined;

  const currentOpen = isControlled ? open : internalOpen;
  const handleOpenChange = isControlled ? onOpenChange : setInternalOpen;

  return (
    <Dialog open={currentOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="px-4 py-2 bg-white text-gray-900 font-semibold rounded-md hover:bg-gray-200 transition">
          Login
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl w-full">
        <VisuallyHidden>
          <DialogTitle>Login</DialogTitle>
        </VisuallyHidden>
        <LoginForm onLoginSuccess={() => handleOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
