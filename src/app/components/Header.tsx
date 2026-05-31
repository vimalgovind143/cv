import { GlobeIcon, MailIcon, PhoneIcon } from 'lucide-react';
import React from 'react';
import { Avatar } from '@/components/avatar';
import { Button } from '@/components/ui/button';
import { RESUME_DATA } from '@/data/resume-data';

interface LocationLinkProps {
  location: typeof RESUME_DATA.location;
  locationLink: typeof RESUME_DATA.locationLink;
}

function LocationLink({ location, locationLink }: LocationLinkProps) {
  return (
    <p className="text-foreground max-w-md items-center font-mono text-xs text-pretty">
      <a
        className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
        href={locationLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Location: ${location}`}
      >
        <GlobeIcon className="size-3" aria-hidden="true" />
        {location}
      </a>
    </p>
  );
}

interface SocialButtonProps {
  href: string;
  icon: React.ElementType;
  label: string;
}

function SocialButton({ href, icon: Icon, label }: SocialButtonProps) {
  return (
    <Button className="size-8" variant="outline" size="icon" asChild>
      <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
        <Icon className="size-4" aria-hidden="true" />
      </a>
    </Button>
  );
}

interface ContactButtonsProps {
  contact: typeof RESUME_DATA.contact;
  personalWebsiteUrl?: string;
}

function ContactButtons({ contact, personalWebsiteUrl }: ContactButtonsProps) {
  return (
    <ul
      className="text-foreground/80 flex list-none gap-x-1 pt-1 font-mono text-sm print:hidden"
      aria-label="Contact links"
    >
      {personalWebsiteUrl && (
        <li>
          <SocialButton href={personalWebsiteUrl} icon={GlobeIcon} label="Personal website" />
        </li>
      )}
      {contact.email && (
        <li>
          <SocialButton href={`mailto:${contact.email}`} icon={MailIcon} label="Email" />
        </li>
      )}
      {contact.tel && (
        <li>
          <SocialButton href={`tel:${contact.tel}`} icon={PhoneIcon} label="Phone" />
        </li>
      )}
      {contact.social.map((social) => (
        <li key={social.name}>
          <SocialButton
            key={social.name}
            href={social.url}
            icon={social.icon}
            label={social.name}
          />
        </li>
      ))}
    </ul>
  );
}

interface PrintContactProps {
  contact: typeof RESUME_DATA.contact;
  personalWebsiteUrl?: string;
}

function PrintContact({ contact, personalWebsiteUrl }: PrintContactProps) {
  return (
    <div className="text-foreground/80 hidden gap-x-2 font-mono text-sm print:flex print:text-[12px]">
      {personalWebsiteUrl && (
        <>
          <a className="hover:text-foreground/70 underline" href={personalWebsiteUrl}>
            {new URL(personalWebsiteUrl).hostname}
          </a>
          <span aria-hidden="true">/</span>
        </>
      )}
      {contact.email && (
        <>
          <a className="hover:text-foreground/70 underline" href={`mailto:${contact.email}`}>
            {contact.email}
          </a>
          <span aria-hidden="true">/</span>
        </>
      )}
      {contact.tel && (
        <a className="hover:text-foreground/70 underline" href={`tel:${contact.tel}`}>
          {contact.tel}
        </a>
      )}
    </div>
  );
}

/**
 * Header component displaying personal information and contact details
 */
export function Header() {
  return (
    <header className="flex items-center justify-between">
      <div className="flex-1 space-y-1.5">
        <h1 className="text-2xl font-bold" id="resume-name">
          {RESUME_DATA.name}
        </h1>
        <p className="text-foreground/80 max-w-md font-mono text-sm text-pretty print:text-[12px]">
          {RESUME_DATA.about}
        </p>

        <LocationLink location={RESUME_DATA.location} locationLink={RESUME_DATA.locationLink} />

        <ContactButtons
          contact={RESUME_DATA.contact}
          personalWebsiteUrl={RESUME_DATA.personalWebsiteUrl}
        />

        <PrintContact
          contact={RESUME_DATA.contact}
          personalWebsiteUrl={RESUME_DATA.personalWebsiteUrl}
        />
      </div>

      <Avatar
        className="size-28"
        src={RESUME_DATA.avatarUrl}
        alt={`${RESUME_DATA.name}'s profile picture`}
        fallback={RESUME_DATA.initials}
      />
    </header>
  );
}
