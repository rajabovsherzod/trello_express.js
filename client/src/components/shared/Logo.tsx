import { Link } from "react-router-dom";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-x-2 transition hover:opacity-75">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256" className="h-6 w-6">
        <rect width="256" height="256" fill="none"></rect>
        <rect x="40" y="40" width="72" height="112" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></rect>
        <rect x="144" y="40" width="72" height="72" rx="8" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="16"></rect>
      </svg>
      <span className="text-lg font-bold">
        Trello Clone
      </span>
    </Link>
  );
};
