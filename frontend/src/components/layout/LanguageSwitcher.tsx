import { useTranslation } from 'react-i18next';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages } from "lucide-react";

const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'ta', name: 'தமிழ்' },
];

export function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const changeLanguage = (code: string) => {
        i18n.changeLanguage(code);
    };

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <Languages className="h-4 w-4" />
                    <span className="hidden md:inline">{currentLanguage.name}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                {languages.map((lang) => (
                    <DropdownMenuItem
                        key={lang.code}
                        onClick={() => changeLanguage(lang.code)}
                        className={i18n.language === lang.code ? "bg-accent" : ""}
                    >
                        {lang.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
