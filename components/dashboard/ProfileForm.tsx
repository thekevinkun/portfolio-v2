"use client";

import { useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui";
import AssetField from "@/components/dashboard/AssetField";
import FormSection from "@/components/dashboard/FormSection";
import TextField from "@/components/dashboard/TextField";
import {
  PRIMARY_SECTIONS,
  SECONDARY_SECTIONS,
  type FieldSection,
} from "./profile-fields";
import { updateProfile } from "@/lib/dashboard/actions/profile";
import { joinLines, readLines, readText } from "@/lib/dashboard/form-data";
import { toFormErrors } from "@/lib/dashboard/form-errors";
import { ASSET_KINDS, type AssetKind } from "@/types/assets";
import { SOCIAL_KINDS, type Profile, type SocialKind } from "@/types/profile";

const SOCIAL_LABELS: Record<SocialKind, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
};

const ASSET_LABELS: Record<AssetKind, string> = {
  avatar: "Avatar",
  portrait: "Portrait",
  resume: "Resume (PDF)",
};

// Server paths ("socials.1.url", "chips.2") to the control that shows them
function renameKey(key: string): string {
  const social = /^socials\.(\d+)\.(url|label)$/.exec(key);
  if (social) {
    const kind = SOCIAL_KINDS[Number(social[1])];
    return kind ? `social.${kind}.${social[2]}` : "socials";
  }
  const list = /^(chips|focusAreas)\.\d+$/.exec(key);
  return list?.[1] ?? key;
}

const ProfileForm = ({ profile }: { profile: Profile }) => {
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  // File URLs live in state because an upload changes them before Save
  const [files, setFiles] = useState<Record<AssetKind, string | null>>({
    avatar: profile.avatarUrl,
    portrait: profile.portraitUrl,
    resume: profile.resumeUrl,
  });

  const saved: Record<AssetKind, string | null> = {
    avatar: profile.avatarUrl,
    portrait: profile.portraitUrl,
    resume: profile.resumeUrl,
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (name: string) => readText(data, name);

    // Get In Touch shows both links (D57), so neither may be empty
    const missing = SOCIAL_KINDS.filter((kind) => !text(`social.${kind}.url`));
    if (missing.length > 0) {
      setErrors(
        Object.fromEntries(
          missing.map((kind) => [
            `social.${kind}.url`,
            "Required: Get In Touch shows this link.",
          ]),
        ),
      );
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const input: Profile = {
      name: text("name"),
      username: text("username"),
      handle: text("handle"),
      roleLabel: text("roleLabel"),
      headline: text("headline"),
      intro: text("intro"),
      chips: readLines(data, "chips"),
      focusAreas: readLines(data, "focusAreas"),
      contactHeadline: text("contactHeadline"),
      contactIntro: text("contactIntro"),
      email: text("email"),
      socials: SOCIAL_KINDS.map((kind) => ({
        kind,
        label: text(`social.${kind}.label`),
        url: text(`social.${kind}.url`),
      })),
      locationLabel: text("locationLabel"),
      timezone: text("timezone"),
      availability: text("availability"),
      availabilityShort: text("availabilityShort"),
      seoTitle: text("seoTitle"),
      seoDescription: text("seoDescription"),
      avatarUrl: files.avatar,
      portraitUrl: files.portrait,
      resumeUrl: files.resume,
    };

    startTransition(async () => {
      const result = await updateProfile(input);
      if (result.ok) {
        setErrors({});
        toast.success("Profile saved");
        return;
      }
      setErrors(toFormErrors(result.fieldErrors, renameKey));
      toast.error(result.error);
    });
  };

  const renderSection = (section: FieldSection) => (
    <FormSection key={section.title} title={section.title}>
      {section.fields.map(({ name, ...field }) => {
        const value = profile[name];
        return (
          <TextField
            key={name}
            name={name}
            {...field}
            defaultValue={Array.isArray(value) ? joinLines(value) : value}
            error={errors[name]}
          />
        );
      })}
    </FormSection>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {PRIMARY_SECTIONS.map(renderSection)}

      <FormSection title="Links">
        {SOCIAL_KINDS.map((kind) => {
          const social = profile.socials.find((item) => item.kind === kind);
          return (
            <div key={kind} className="grid gap-4 sm:grid-cols-[1fr_2fr]">
              <TextField
                name={`social.${kind}.label`}
                label={`${SOCIAL_LABELS[kind]} label`}
                defaultValue={social?.label ?? SOCIAL_LABELS[kind]}
                error={errors[`social.${kind}.label`]}
              />
              <TextField
                name={`social.${kind}.url`}
                label={`${SOCIAL_LABELS[kind]} URL`}
                defaultValue={social?.url ?? ""}
                error={errors[`social.${kind}.url`]}
              />
            </div>
          );
        })}
      </FormSection>

      {SECONDARY_SECTIONS.map(renderSection)}

      <FormSection
        title="Files"
        description="An upload goes live when you save the profile."
      >
        {ASSET_KINDS.map((kind) => (
          <AssetField
            key={kind}
            kind={kind}
            label={ASSET_LABELS[kind]}
            value={files[kind]}
            savedValue={saved[kind]}
            onChange={(url) =>
              setFiles((previous) => ({ ...previous, [kind]: url }))
            }
          />
        ))}
      </FormSection>

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end border-t border-glass-border bg-obsidian px-6 py-3 lg:-mx-10 lg:px-10">
        <Button
          type="submit"
          disabled={pending}
          className="disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
