import { NextRequest, NextResponse } from "next/server";

// Weighted spam trigger word categories
const TRIGGER_WORDS: { word: string; weight: number; category: string }[] = [
  // High risk
  { word: "buy now", weight: 8, category: "aggressive CTA" },
  { word: "click here", weight: 7, category: "aggressive CTA" },
  { word: "free", weight: 6, category: "promotional" },
  { word: "guaranteed", weight: 7, category: "false promise" },
  { word: "no obligation", weight: 6, category: "false promise" },
  { word: "winner", weight: 8, category: "scam pattern" },
  { word: "you've been selected", weight: 9, category: "scam pattern" },
  { word: "congratulations", weight: 6, category: "scam pattern" },
  { word: "you have won", weight: 9, category: "scam pattern" },
  { word: "claim your", weight: 7, category: "scam pattern" },
  { word: "act now", weight: 7, category: "urgency" },
  { word: "limited time", weight: 5, category: "urgency" },
  { word: "urgent", weight: 6, category: "urgency" },
  { word: "don't miss out", weight: 5, category: "urgency" },
  { word: "expire", weight: 4, category: "urgency" },
  { word: "last chance", weight: 5, category: "urgency" },
  { word: "risk free", weight: 5, category: "false promise" },
  { word: "100%", weight: 4, category: "false promise" },
  { word: "earn money", weight: 8, category: "financial" },
  { word: "make money", weight: 8, category: "financial" },
  { word: "extra income", weight: 7, category: "financial" },
  { word: "work from home", weight: 7, category: "financial" },
  { word: "credit card", weight: 5, category: "financial" },
  { word: "cash", weight: 4, category: "financial" },
  { word: "money back", weight: 5, category: "financial" },
  { word: "refund", weight: 4, category: "financial" },
  { word: "discount", weight: 3, category: "promotional" },
  { word: "save big", weight: 5, category: "promotional" },
  { word: "best price", weight: 4, category: "promotional" },
  { word: "lowest price", weight: 5, category: "promotional" },
  { word: "unsubscribe", weight: 2, category: "compliance" }, // low risk — good to have
  { word: "opt out", weight: 2, category: "compliance" },
  { word: "spam", weight: 5, category: "meta" },
  { word: "this is not spam", weight: 9, category: "meta" },
  { word: "password", weight: 6, category: "phishing" },
  { word: "verify your account", weight: 8, category: "phishing" },
  { word: "confirm your", weight: 5, category: "phishing" },
  { word: "account suspended", weight: 8, category: "phishing" },
  { word: "update your information", weight: 7, category: "phishing" },
];

interface TriggerHit {
  word: string;
  weight: number;
  category: string;
  count: number;
}

interface ContentIssue {
  label: string;
  detail: string;
  severity: "high" | "medium" | "low";
  points: number;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

function countLinks(text: string): number {
  return (text.match(/https?:\/\/[^\s"'<>)]+/gi) || []).length;
}

function hasUnsubscribeLink(text: string): boolean {
  const lower = text.toLowerCase();
  return lower.includes("unsubscribe") || lower.includes("opt-out") || lower.includes("opt out") || lower.includes("manage preferences");
}

function capsRatio(text: string): number {
  const letters = text.replace(/[^a-zA-Z]/g, "");
  if (!letters) return 0;
  const caps = text.replace(/[^A-Z]/g, "");
  return caps.length / letters.length;
}

function excessivePunctuation(text: string): number {
  const matches = text.match(/[!?]{2,}|!{1,}/g) || [];
  return matches.reduce((n, m) => n + m.length, 0);
}

function imageCount(html: string): number {
  return (html.match(/<img[^>]+>/gi) || []).length;
}

export async function POST(req: NextRequest) {
  try {
    const { content, subject } = await req.json();
    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Email content required" }, { status: 400 });
    }

    const isHtml = content.trim().startsWith("<") || content.includes("<html") || content.includes("<body") || content.includes("<p");
    const plainText = isHtml ? stripHtml(content) : content;
    const lowerText = plainText.toLowerCase();

    const issues: ContentIssue[] = [];
    let spamScore = 0;

    // ── Trigger word analysis ─────────────────────────────────────────────────
    const triggerHits: TriggerHit[] = [];
    for (const trigger of TRIGGER_WORDS) {
      const regex = new RegExp(`\\b${trigger.word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "gi");
      const matches = lowerText.match(regex);
      if (matches) {
        // Skip unsubscribe — it's good practice
        if (trigger.word !== "unsubscribe" && trigger.word !== "opt out") {
          triggerHits.push({ ...trigger, count: matches.length });
          spamScore += trigger.weight * matches.length;
        }
      }
    }

    // ── Structural checks ─────────────────────────────────────────────────────
    const wordCount = countWords(plainText);
    const linkCount = countLinks(content);
    const hasUnsub = hasUnsubscribeLink(content);
    const caps = capsRatio(plainText);
    const exclamations = excessivePunctuation(content);
    const imgCount = isHtml ? imageCount(content) : 0;

    // Word count
    if (wordCount < 50) {
      issues.push({ label: "Very short content", detail: `Only ${wordCount} words — very short emails with few words look spammy. Aim for at least 100 words.`, severity: "medium", points: 10 });
      spamScore += 10;
    }

    // Link density
    if (linkCount > 5) {
      issues.push({ label: "High link count", detail: `${linkCount} links detected — excessive links trigger spam filters. Keep it under 3-5 for cold email.`, severity: "high", points: 15 });
      spamScore += 15;
    } else if (linkCount > 3) {
      issues.push({ label: "Multiple links", detail: `${linkCount} links detected — consider reducing to 1-2 links for cold email.`, severity: "low", points: 5 });
      spamScore += 5;
    }

    // Unsubscribe link
    if (!hasUnsub) {
      issues.push({ label: "No unsubscribe link", detail: "Missing unsubscribe link — required by CAN-SPAM and GDPR for marketing emails, and helps avoid spam complaints.", severity: "medium", points: 8 });
      spamScore += 8;
    }

    // ALL CAPS ratio
    if (caps > 0.4) {
      issues.push({ label: "Excessive ALL CAPS", detail: `${Math.round(caps * 100)}% of letters are uppercase — excessive capitalization is a strong spam signal.`, severity: "high", points: 20 });
      spamScore += 20;
    } else if (caps > 0.25) {
      issues.push({ label: "High CAPS usage", detail: `${Math.round(caps * 100)}% uppercase letters detected — reduce capitalization for better deliverability.`, severity: "medium", points: 10 });
      spamScore += 10;
    }

    // Excessive exclamation marks
    if (exclamations > 5) {
      issues.push({ label: "Excessive exclamation marks", detail: `${exclamations} exclamation marks detected — spam filters flag excessive use of ! and !!`, severity: "medium", points: 10 });
      spamScore += 10;
    }

    // Image-heavy content
    if (isHtml && imgCount > 0 && wordCount < 30) {
      issues.push({ label: "Image-heavy content", detail: `${imgCount} image(s) with very little text — image-only or mostly-image emails are a major spam trigger.`, severity: "high", points: 20 });
      spamScore += 20;
    } else if (isHtml && imgCount > 3) {
      issues.push({ label: "Many images", detail: `${imgCount} images detected — high image counts can trigger spam filters. Keep images minimal.`, severity: "low", points: 5 });
      spamScore += 5;
    }

    // Subject line analysis
    let subjectIssues: string[] = [];
    if (subject) {
      const subjectLower = subject.toLowerCase();
      if (capsRatio(subject) > 0.4) subjectIssues.push("Excessive CAPS in subject line");
      if (subject.includes("!")) subjectIssues.push("Exclamation mark in subject");
      if (subjectLower.includes("re:") && !subjectLower.startsWith("re:")) subjectIssues.push("Fake reply prefix (Re:) in subject — major spam signal");
      if (subjectLower.includes("fw:") || subjectLower.includes("fwd:")) subjectIssues.push("Fake forward prefix in subject");
      if (/\$|\d+%\s*off|\bfree\b/i.test(subject)) subjectIssues.push("Promotional language in subject (free, $, % off)");
      if (subject.length > 60) subjectIssues.push(`Subject is ${subject.length} chars — aim for under 60`);
      if (subjectIssues.length) {
        issues.push({ label: "Subject line issues", detail: subjectIssues.join("; "), severity: "high", points: 15 });
        spamScore += 15;
      }
    }

    // Cap spam score at 100
    spamScore = Math.min(100, spamScore);
    const deliverabilityScore = Math.max(0, 100 - spamScore);

    const verdict = deliverabilityScore >= 80 ? "clean"
      : deliverabilityScore >= 60 ? "risky"
      : deliverabilityScore >= 40 ? "likely-spam"
      : "spam";

    // Group trigger hits by category
    const byCategory: Record<string, TriggerHit[]> = {};
    for (const hit of triggerHits) {
      if (!byCategory[hit.category]) byCategory[hit.category] = [];
      byCategory[hit.category].push(hit);
    }

    return NextResponse.json({
      isHtml,
      wordCount,
      linkCount,
      hasUnsubscribeLink: hasUnsub,
      imageCount: imgCount,
      capsRatio: Math.round(caps * 100),
      exclamationCount: exclamations,
      triggerHits: triggerHits.sort((a, b) => b.weight * b.count - a.weight * a.count),
      triggersByCategory: byCategory,
      issues: issues.sort((a, b) => b.points - a.points),
      subjectIssues,
      spamScore,
      deliverabilityScore,
      verdict,
    });
  } catch (e: unknown) {
    return NextResponse.json({ error: `Analysis failed: ${e instanceof Error ? e.message : "unknown"}` }, { status: 500 });
  }
}
