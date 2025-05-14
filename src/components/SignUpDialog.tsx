'use client'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

export function SignUpDialog() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert("Passwords do not match")
      return
    }

    try {
      const res = await fetch("http://localhost:8089/api/signup/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password,password2: confirmPassword}),
      })

      const data = await res.json()
      if (res.ok) {
        alert("Signup successful! You can now log in.")
      } else {
        alert(data.detail || "Signup failed.")
      }
    } catch (err) {
      console.error(err)
      alert("Error signing up.")
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="ml-2 px-4 py-2 bg-sky-500 text-white font-semibold rounded-md hover:bg-sky-600 transition">Sign up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md w-full">
        <DialogTitle className="text-xl font-semibold mb-1">
          Create an account
        </DialogTitle>
        <p className="text-sm text-muted-foreground mb-4">
          Sign up to access Acme Inc
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Sign up
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
