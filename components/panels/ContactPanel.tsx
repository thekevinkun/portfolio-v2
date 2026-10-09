import { LiveClock } from "@/components/chrome";
import { ButtonLink, GlassCard, Pill } from "@/components/ui";
import { ContactLinkCard } from "./";
import { displayUrl, utcOffsetLabel } from "@/lib/contact/format";
import type { Profile } from "@/types/profile";

interface ContactPanelProps {
  profile: Profile;
}

// Base styles are the compact tier. Two columns from 1024px, stacked below.
// The intro paragraph shows from 768px; availability and location live here
// because the footer is hidden on phones (D19).
const ContactPanel = ({ profile }: ContactPanelProps) => (
  <div className="tier-container h-full">
    <div className="flex h-full flex-col justify-center px-5 pt-2 pb-4 md:px-12">
      <div className="grid gap-4 tier-regular:gap-5 lg:grid-cols-12 lg:gap-10">
        <div className="flex flex-col gap-4 lg:col-span-7 tier-spacious:gap-4">
          <h2
            id="heading-contact"
            className="text-2xl font-extrabold tracking-tight text-fg-high tier-regular:text-3xl tier-spacious:text-4xl"
          >
            {profile.contactHeadline}
          </h2>
          <p className="max-w-2xl lg:max-w-lg text-base leading-relaxed text-fg-medium">
            {profile.contactIntro}
          </p>
          <Pill dot="static" className="self-start font-mono text-[11px]">
            {profile.availability}
          </Pill>
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <ButtonLink
              href={`mailto:${profile.email}`}
              className="max-sm:px-5 max-sm:py-2.5 max-sm:text-xs"
            >
              Email me
            </ButtonLink>
            {profile.resumeUrl && (
              <ButtonLink
                href={profile.resumeUrl}
                download
                variant="secondary"
                className="max-sm:px-5 max-sm:py-2.5 max-sm:text-xs"
              >
                Download Resume ↗
              </ButtonLink>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2 lg:col-span-5 tier-regular:gap-3">
          <ContactLinkCard
            href={`mailto:${profile.email}`}
            iconKey="email"
            label="Email"
            value={profile.email}
          />
          {profile.socials.map((social) => (
            <ContactLinkCard
              key={social.kind}
              href={social.url}
              iconKey={social.kind}
              label={social.label}
              value={displayUrl(social.url)}
              external
            />
          ))}
          <GlassCard className="grid grid-cols-2 gap-3 p-2.5 tier-regular:p-3 tier-spacious:p-4">
            <div>
              <p className="font-mono text-[10px] tracking-wider text-fg-low uppercase">
                Location
              </p>
              <p className="text-xs font-semibold text-fg-high tier-regular:text-sm">
                {profile.locationLabel}
              </p>
            </div>
            <div>
              <p className="font-mono text-[10px] tracking-wider text-fg-low uppercase">
                Local time ({utcOffsetLabel(profile.timezone)})
              </p>
              <LiveClock
                timeZone={profile.timezone}
                className="font-mono text-xs font-semibold text-fg-high tier-regular:text-sm"
              />
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  </div>
);

export default ContactPanel;
