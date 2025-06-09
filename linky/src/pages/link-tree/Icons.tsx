import { Globe, Instagram, Twitter, Youtube, Facebook, Linkedin, Github, Mail, ExternalLink } from "lucide-react"

export const iconOptions = [
    { value: "external", label: "Default", icon: <ExternalLink className="h-4 w-4" /> },
    { value: "instagram", label: "Instagram", icon: <Instagram className="h-4 w-4" /> },
    { value: "twitter", label: "Twitter", icon: <Twitter className="h-4 w-4" /> },
    { value: "youtube", label: "YouTube", icon: <Youtube className="h-4 w-4" /> },
    { value: "facebook", label: "Facebook", icon: <Facebook className="h-4 w-4" /> },
    { value: "linkedin", label: "LinkedIn", icon: <Linkedin className="h-4 w-4" /> },
    { value: "github", label: "GitHub", icon: <Github className="h-4 w-4" /> },
    { value: "globe", label: "Website", icon: <Globe className="h-4 w-4" /> },
    { value: "mail", label: "Email", icon: <Mail className="h-4 w-4" /> },
]
