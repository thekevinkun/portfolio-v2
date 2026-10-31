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
import { toFormErrors } from "@/lib/dashboard/form-errors";
import { updateProfile } from "@/lib/dashboard/actions/profile";
import { joinLines, readLines, readText } from "@/lib/dashboard/form-data";
import { revokePending } from "@/lib/dashboard/pending-asset";
import { discardAsset, uploadAsset } from "@/lib/dashboard/actions/assets";
import { SOCIAL_KINDS, type Profile, type SocialKind } from "@/types/profile";
// The profile form edits the three profile files; the logo belongs to projects
import {
  PROFILE_ASSET_KINDS as ASSET_KINDS,
  type AssetChange,
  type ProfileAssetKind as AssetKind,
} from "@/types/assets";

const SOCIAL_LABELS: Record<SocialKind, string> = {
  linkedin: "LinkedIn",
  upwork: "Upwork",
  github: "GitHub",
};

// Get In Touch needs these two (D57); the other links are optional (D135)
const REQUIRED_SOCIALS: readonly SocialKind[] = ["linkedin", "github"];

const ASSET_LABELS: Record<AssetKind, string> = {
  avatar: "Avatar",
  portrait: "Portrait",
  resume: "Resume (PDF)",
};

// Server paths ("socials.1.url", "chips.2") to the control that shows them.
// kinds = the links that were sent, in order (an empty optional link is left out)
function renameKey(key: string, kinds: readonly SocialKind[]): string {
  const social = /^socials\.(\d+)\.(url|label)$/.exec(key);
  if (social) {
    const kind = kinds[Number(social[1])];
    return kind ? `social.${kind}.${social[2]}` : "socials";
  }
  const list = /^(chips|focusAreas)\.\d+$/.exec(key);
  return list?.[1] ?? key;
}

// Deletes files uploaded during a save that then failed. The server refuses
// to delete anything a saved row uses, so this is safe.
async function rollbackUploads(urls: string[]) {
  await Promise.all(urls.map((url) => discardAsset({ url }).catch(() => {})));
}

const ProfileForm = ({ profile }: { profile: Profile }) => {
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  // What the database holds for each file
  const [saved, setSaved] = useState<Record<AssetKind, string | null>>({
    avatar: profile.avatarUrl,
    portrait: profile.portraitUrl,
    resume: profile.resumeUrl,
  });
  // Files picked but not uploaded yet; nothing leaves the browser until Save
  const [changes, setChanges] = useState<
    Partial<Record<AssetKind, AssetChange>>
  >({});

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const text = (name: string) => readText(data, name);

    // Get In Touch shows LinkedIn and GitHub (D57), so neither may be empty
    const missing = REQUIRED_SOCIALS.filter(
      (kind) => !text(`social.${kind}.url`),
    );
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

    // An empty optional link (Upwork) is left out of the saved row
    const sent = SOCIAL_KINDS.filter((kind) => text(`social.${kind}.url`));

    const textInput = {
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
      socials: sent.map((kind) => ({
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
    };

    startTransition(async () => {
      const urls: Record<AssetKind, string | null> = { ...saved };
      const uploaded: string[] = [];

      try {
        // 1. Upload only the files that changed, one request each
        for (const kind of ASSET_KINDS) {
          const change = changes[kind];
          if (change === undefined) continue;
          if (change === null) {
            urls[kind] = null;
            continue;
          }

          const body = new FormData();
          body.set("kind", kind);
          body.set("file", change.file);
          const upload = await uploadAsset(body);

          if (!upload.ok) {
            await rollbackUploads(uploaded);
            toast.error(`${ASSET_LABELS[kind]}: ${upload.error}`);
            return;
          }
          uploaded.push(upload.data.url);
          urls[kind] = upload.data.url;
        }

        // 2. Save the profile with the final URLs
        const result = await updateProfile({
          ...textInput,
          avatarUrl: urls.avatar,
          portraitUrl: urls.portrait,
          resumeUrl: urls.resume,
        });

        if (!result.ok) {
          // The database was not changed, so the new files must not stay
          await rollbackUploads(uploaded);
          setErrors(
            toFormErrors(result.fieldErrors, (key) => renameKey(key, sent)),
          );
          toast.error(result.error);
          return;
        }

        setErrors({});
        for (const kind of ASSET_KINDS) revokePending(changes[kind]);
        setChanges({});
        setSaved(urls);
        if (result.data.cleanupFailed) {
          toast.warning("Saved, but an old file could not be deleted.");
        } else {
          toast.success("Profile saved");
        }
      } catch {
        await rollbackUploads(uploaded);
        toast.error("Something went wrong. Please try again.");
      }
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
                hint={
                  REQUIRED_SOCIALS.includes(kind)
                    ? undefined
                    : "Optional. Leave empty to hide this link."
                }
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
        description="Files are uploaded only when you press Save changes."
      >
        {ASSET_KINDS.map((kind) => (
          <AssetField
            key={kind}
            kind={kind}
            label={ASSET_LABELS[kind]}
            savedUrl={saved[kind]}
            change={changes[kind]}
            disabled={pending}
            onChange={(change) =>
              setChanges((previous) => ({ ...previous, [kind]: change }))
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
