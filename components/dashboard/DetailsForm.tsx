"use client";

import { useState, useTransition, type FormEvent } from "react";
import { toast } from "sonner";
import { Button, ButtonLink } from "@/components/ui";
import CountedField from "./CountedField";
import FormSection from "./FormSection";
import TitledRows, { type TitledRow } from "./TitledRows";
import { FieldRow, Input } from "./ui";
import { updateProjectDetails } from "@/lib/dashboard/actions/project-details";
import { toFormErrors } from "@/lib/dashboard/form-errors";
import { parseYoutubeId } from "@/lib/projects/youtube";
import type { AdminProject } from "@/types/admin";
import {
  MAX_DETAIL_FEATURES,
  MAX_DETAIL_FEATURE_TEXT,
  MAX_DETAIL_FEATURE_TITLE,
  MAX_DETAIL_NOTES,
  MAX_DETAIL_NOTE_BODY,
  MAX_DETAIL_NOTE_TITLE,
  MAX_DETAIL_PROBLEM,
  MAX_DETAIL_ROLE,
  MAX_DETAIL_TIMEFRAME,
} from "@/types/limits";

const VIDEO_ERROR = "Paste a YouTube link or the 11-character video id.";

// A fully blank row is dropped on save; a half-filled one goes to the server,
// which reports "Required." on the empty field
const isFilled = (row: TitledRow) =>
  row.title.trim() !== "" || row.body.trim() !== "";

const DetailsForm = ({ project }: { project: AdminProject }) => {
  const saved = project.details;
  const [pending, startTransition] = useTransition();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [problem, setProblem] = useState(saved?.problem ?? "");
  const [role, setRole] = useState(saved?.role ?? "");
  const [timeframe, setTimeframe] = useState(saved?.timeframe ?? "");
  const [video, setVideo] = useState(saved?.videoId ?? "");
  const [features, setFeatures] = useState<TitledRow[]>(() =>
    (saved?.features ?? []).map((feature, index) => ({
      key: `saved-${index}`,
      title: feature.title,
      body: feature.text,
    })),
  );
  const [notes, setNotes] = useState<TitledRow[]>(() =>
    (saved?.notes ?? []).map((note, index) => ({
      key: `saved-${index}`,
      title: note.title,
      body: note.body,
    })),
  );

  const videoId = parseYoutubeId(video);
  const videoError =
    video.trim() !== "" && videoId === null ? VIDEO_ERROR : undefined;
  const screenshots = saved?.screenshots ?? [];
  const screenshotError = Object.entries(errors).find(([key]) =>
    key.startsWith("screenshots"),
  )?.[1];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (videoError) {
      setErrors({ videoId: videoError });
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const keptFeatures = features.filter(isFilled);
    const keptNotes = notes.filter(isFilled);
    const kept = { feature: keptFeatures, note: keptNotes };
    const problemText = problem.trim();
    const roleText = role.trim();
    const timeframeText = timeframe.trim();

    // Server paths ("features.2.title") to the row that shows them
    const rename = (key: string): string => {
      const match = /^(features|notes)\.(\d+)\.(title|text|body)$/.exec(key);
      if (!match) return key;
      const group = match[1] === "features" ? "feature" : "note";
      const row = kept[group][Number(match[2])];
      if (!row) return match[1] ?? key;
      return `${group}.${row.key}.${match[3] === "title" ? "title" : "body"}`;
    };

    const isEmpty =
      !problemText &&
      !roleText &&
      !timeframeText &&
      !videoId &&
      keptFeatures.length === 0 &&
      keptNotes.length === 0 &&
      screenshots.length === 0;

    startTransition(async () => {
      try {
        const result = await updateProjectDetails({
          slug: project.slug,
          details: {
            ...(problemText ? { problem: problemText } : {}),
            ...(roleText ? { role: roleText } : {}),
            ...(timeframeText ? { timeframe: timeframeText } : {}),
            features: keptFeatures.map((row) => ({
              title: row.title,
              text: row.body,
            })),
            notes: keptNotes.map((row) => ({
              title: row.title,
              body: row.body,
            })),
            // Saved screenshots go back unchanged until the screenshot editor
            screenshots,
            ...(videoId ? { videoId } : {}),
          },
        });

        if (!result.ok) {
          setErrors(toFormErrors(result.fieldErrors, rename));
          toast.error(result.error);
          return;
        }

        setErrors({});
        setFeatures(keptFeatures);
        setNotes(keptNotes);
        setVideo(videoId ?? "");
        toast.success(
          isEmpty
            ? "Details cleared: this project has no Details button"
            : "Details saved",
        );
      } catch (error) {
        console.error("Could not save the details:", error);
        toast.error(
          "Could not save the details. Check your connection and try again.",
        );
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <FormSection
        title="Overview"
        description="Shown next to the summary. Leave a field empty to hide it."
      >
        <CountedField
          id="problem"
          label="The problem"
          value={problem}
          max={MAX_DETAIL_PROBLEM}
          rows={5}
          hint="What was hard or missing, and for whom."
          error={errors.problem}
          disabled={pending}
          onChange={setProblem}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <CountedField
            id="role"
            label="Your role"
            value={role}
            max={MAX_DETAIL_ROLE}
            error={errors.role}
            disabled={pending}
            onChange={setRole}
          />
          <CountedField
            id="timeframe"
            label="Timeframe"
            value={timeframe}
            max={MAX_DETAIL_TIMEFRAME}
            error={errors.timeframe}
            disabled={pending}
            onChange={setTimeframe}
          />
        </div>
      </FormSection>

      <FormSection
        title="What it does"
        description={`Up to ${MAX_DETAIL_FEATURES} features. A short title and one or two sentences each.`}
      >
        <TitledRows
          idPrefix="feature"
          itemLabel="Feature"
          addLabel="Add feature"
          bodyLabel="Description"
          rows={features}
          onChange={setFeatures}
          max={MAX_DETAIL_FEATURES}
          titleMax={MAX_DETAIL_FEATURE_TITLE}
          bodyMax={MAX_DETAIL_FEATURE_TEXT}
          bodyRows={3}
          errors={errors}
          listError={errors.features}
          disabled={pending}
        />
      </FormSection>

      <FormSection
        title="Engineering notes"
        description={`Up to ${MAX_DETAIL_NOTES} notes about decisions and trade-offs: what you chose, why, and what it cost. A blank line starts a new paragraph.`}
      >
        <TitledRows
          idPrefix="note"
          itemLabel="Note"
          addLabel="Add note"
          bodyLabel="Text"
          titleHint="The decision, in a few words."
          rows={notes}
          onChange={setNotes}
          max={MAX_DETAIL_NOTES}
          titleMax={MAX_DETAIL_NOTE_TITLE}
          bodyMax={MAX_DETAIL_NOTE_BODY}
          bodyRows={7}
          errors={errors}
          listError={errors.notes}
          disabled={pending}
        />
      </FormSection>

      <FormSection
        title="Video"
        description="Optional. The video stays on YouTube; nothing is uploaded here."
      >
        <FieldRow
          label="YouTube link or video id"
          htmlFor="videoId"
          hint={
            videoId
              ? `Video id: ${videoId}. Only the id is saved. The video must allow embedding on other sites.`
              : "Paste the link or the 11-character id. The video must allow embedding on other sites."
          }
          error={videoError ?? errors.videoId}
        >
          <Input
            id="videoId"
            name="videoId"
            type="text"
            value={video}
            placeholder="https://www.youtube.com/watch?v=…"
            disabled={pending}
            aria-invalid={(videoError ?? errors.videoId) ? true : undefined}
            aria-describedby={
              (videoError ?? errors.videoId)
                ? "videoId-hint videoId-error"
                : "videoId-hint"
            }
            onChange={(event) => setVideo(event.currentTarget.value)}
          />
        </FieldRow>
      </FormSection>

      {screenshots.length > 0 ? (
        <p className="text-xs text-fg-low">
          {screenshots.length} saved{" "}
          {screenshots.length === 1 ? "screenshot is" : "screenshots are"} kept
          as they are.
        </p>
      ) : null}
      {screenshotError ? (
        <p role="alert" className="text-xs text-danger">
          Screenshots: {screenshotError}
        </p>
      ) : null}
      {errors._form ? (
        <p role="alert" className="text-xs text-danger">
          {errors._form}
        </p>
      ) : null}

      <div className="sticky bottom-0 -mx-6 flex items-center justify-end gap-3 border-t border-glass-border bg-obsidian px-6 py-3 lg:-mx-10 lg:px-10">
        <ButtonLink
          href={`/dashboard/projects/${project.slug}`}
          variant="secondary"
        >
          Back to project
        </ButtonLink>
        <Button
          type="submit"
          disabled={pending}
          className="disabled:opacity-50"
        >
          {pending ? "Saving…" : "Save details"}
        </Button>
      </div>
    </form>
  );
};

export default DetailsForm;
