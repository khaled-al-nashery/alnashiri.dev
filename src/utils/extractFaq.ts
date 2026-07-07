/**
 * Extracts FAQ items from markdown content.
 *
 * Looks for an H2 heading that starts with "Frequently Asked Questions"
 * followed by H3 sub-headings (the questions) and their body text (the answers).
 *
 * Returns an array of `{ question, answer }` objects suitable for FAQPage JSON-LD.
 */
export interface FaqItem {
  question: string;
  answer: string;
}

export function extractFaq(markdown: string): FaqItem[] {
  const lines = markdown.split("\n");
  const items: FaqItem[] = [];

  let inFaqSection = false;
  let currentQuestion = "";
  let currentAnswer: string[] = [];

  for (const line of lines) {
    // Detect the FAQ H2 section
    if (/^## .*Frequently Asked Questions/i.test(line)) {
      inFaqSection = true;
      continue;
    }

    if (!inFaqSection) continue;

    // A new H2 means we've left the FAQ section
    if (/^## /.test(line) && !/^### /.test(line)) {
      // Flush last Q/A
      if (currentQuestion && currentAnswer.length > 0) {
        items.push({
          question: currentQuestion,
          answer: currentAnswer.join(" ").trim(),
        });
      }
      break;
    }

    // H3 = new question
    if (/^### /.test(line)) {
      // Flush previous Q/A
      if (currentQuestion && currentAnswer.length > 0) {
        items.push({
          question: currentQuestion,
          answer: currentAnswer.join(" ").trim(),
        });
      }
      currentQuestion = line.replace(/^### /, "").trim();
      currentAnswer = [];
      continue;
    }

    // Collect answer lines (skip blank lines at start)
    const trimmed = line.trim();
    if (trimmed || currentAnswer.length > 0) {
      if (trimmed) currentAnswer.push(trimmed);
    }
  }

  // Flush final Q/A
  if (currentQuestion && currentAnswer.length > 0) {
    items.push({
      question: currentQuestion,
      answer: currentAnswer.join(" ").trim(),
    });
  }

  return items;
}
