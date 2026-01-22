import { Link } from 'react-router-dom';

interface LogoProps {
    className?: string;
    to?: string;
}

export default function Logo({ className = "w-10 h-10", to }: LogoProps) {
    const content = (
        <img
            src="/logo1.svg"
            alt="Orbit Logo"
            className={`${className} object-contain`}
        />
    );

    if (to) {
        return (
            <Link to={to} className="flex items-center hover:opacity-100 transition-opacity">
                {content}
            </Link>
        );
    }

    return content;
}
