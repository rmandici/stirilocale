import Link from "next/link";

function SocialIcon({ children }: { children: React.ReactNode }) {
  return (
    <a
      href="#"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 hover:bg-white/15"
      aria-label="Social"
    >
      {children}
    </a>
  );
}

function IconFacebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.2-1.5 1.5-1.5H16.8V5a25 25 0 0 0-2.7-.1c-2.7 0-4.6 1.6-4.6 4.6V11H6.7v3h2.8v8h4z" />
    </svg>
  );
}

function IconInstagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M17.5 6.5h.01" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

function IconX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.9 3H21l-6.6 7.6L22 21h-6.5l-5.1-6.1L5 21H3l7.1-8.2L2.7 3H9.3l4.6 5.4L18.9 3Zm-2.3 16h1.7L7.5 4.9H5.7L16.6 19Z" />
    </svg>
  );
}

function IconYouTube(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M21.6 7.2a3 3 0 0 0-2.1-2.1C17.7 4.6 12 4.6 12 4.6s-5.7 0-7.5.5A3 3 0 0 0 2.4 7.2 31 31 0 0 0 2 12a31 31 0 0 0 .4 4.8 3 3 0 0 0 2.1 2.1c1.8.5 7.5.5 7.5.5s5.7 0 7.5-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.4-4.8ZM10 15.3V8.7L15.7 12 10 15.3Z" />
    </svg>
  );
}

function IconTikTok(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M16.5 3c.4 2.6 1.9 4.1 4.5 4.5V11c-1.7 0-3.2-.5-4.5-1.4V16c0 4-3.3 7-7.4 6.4-2.7-.4-4.9-2.6-5.3-5.3C3.2 12.9 6.2 9.6 10.2 9.6c.3 0 .6 0 .9.1v3.7c-.3-.1-.6-.2-.9-.2-1.9 0-3.3 1.7-2.9 3.6.2 1 .9 1.8 1.9 2 .2 0 .4.1.6.1 1.7 0 3-1.3 3-3V3h3.7Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0B2A45] dark:bg-[#0b131a] text-white">
      <div className="mx-auto max-w-[80rem] px-4 py-10">
        <div className="flex flex-col items-center gap-6">
          {/* Links */}
          <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-white/80">
            <Link href="/termeni" className="hover:text-white">
              Termeni și condiții
            </Link>
            <Link href="/confidentialitate" className="hover:text-white">
              Politica de confidențialitate
            </Link>

            <Link href="/contact" className="hover:text-white">
              Contact
            </Link>
            <Link href="/despre" className="hover:text-white">
              Despre noi
            </Link>
          </div>

          {/* Socials */}
          <div className="flex justify-center gap-3">
            <SocialIcon>
              <IconFacebook className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon>
              <IconInstagram className="h-5 w-5" />
            </SocialIcon>
            <SocialIcon>
              <IconX className="h-4 w-4" />
            </SocialIcon>
            <SocialIcon>
              <IconYouTube className="h-5 w-5" />
            </SocialIcon>
            <SocialIcon>
              <IconTikTok className="h-4 w-4" />
            </SocialIcon>
          </div>

          {/* Copyright */}
          <div className="text-center text-[11px] text-white/60">
            © {new Date().getFullYear()} callatispress.ro · Toate drepturile
            rezervate
          </div>
        </div>
      </div>
    </footer>
  );
}
