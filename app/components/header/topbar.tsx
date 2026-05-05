import { DynamicIcon } from 'lucide-react/dynamic';
import Link from 'next/link';

export default function TopBar({ social }: { social: { icon: string; url: string }[] }) {
  return (
    <div className="bg-primary py-2">
      <div className="container text-white gap-10 flex items-center justify-end">
        <h6 className=" text-sm font-[300] relative">
          Follow Us
          <div className="absolute h-[1.5px] w-10 bottom-0 bg-white/50 -right-4"></div>
          <div className="absolute h-[1.5px] w-10 -bottom-1 bg-white/50 -right-7"></div>
        </h6>
        <div className="flex items-center gap-2">
          {social.map((profile, index) => (
            <Link
              key={`social_${index}`}
              href={profile.url}
              target="_blank"
            >
              {profile.icon === 'twitter' ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="13"
                  height="13"
                  fill="currentColor"
                  className="bi bi-twitter-x"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z" />
                </svg>
              ) : (
                <DynamicIcon
                  name={profile.icon as Parameters<typeof DynamicIcon>[0]['name']}
                  size={16}
                />
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
