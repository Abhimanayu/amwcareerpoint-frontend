/**
 * Content validation for mobile-safe blog rendering
 */

export interface ContentValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
  suggestions: string[];
}

type ContentValidationCheckResult = Pick<
  ContentValidationResult,
  'warnings' | 'errors' | 'suggestions'
>;

export function validateBlogContent(htmlContent: string): ContentValidationResult {
  const result: ContentValidationResult = {
    isValid: true,
    warnings: [],
    errors: [],
    suggestions: [],
  };

  if (!htmlContent || !htmlContent.trim()) {
    result.errors.push('Content cannot be empty');
    result.isValid = false;
    return result;
  }

  // Check for potentially problematic content
  const checks = [
    checkImageSizes,
    checkTableWidth,
    checkLongWords,
    checkEmbeddedContent,
    checkInlineStyles,
    checkAccessibility,
  ];

  for (const check of checks) {
    const checkResult = check(htmlContent);
    result.warnings.push(...checkResult.warnings);
    result.errors.push(...checkResult.errors);
    result.suggestions.push(...checkResult.suggestions);
  }

  if (result.errors.length > 0) {
    result.isValid = false;
  }

  return result;
}

function checkImageSizes(content: string) {
  const result: ContentValidationCheckResult = { warnings: [], errors: [], suggestions: [] };
  
  // Check for images without proper responsive classes
  const imgRegex = /<img[^>]*>/gi;
  const matches = content.match(imgRegex) || [];
  
  for (const img of matches) {
    if (!img.includes('max-w-full') && !img.includes('w-full')) {
      result.warnings.push('Images should include responsive width classes for mobile compatibility');
      result.suggestions.push('Add responsive classes like "max-w-full h-auto" to images');
      break;
    }
  }
  
  return result;
}

function checkTableWidth(content: string) {
  const result: ContentValidationCheckResult = { warnings: [], errors: [], suggestions: [] };
  
  // Check for tables without responsive wrapper
  if (content.includes('<table') && !content.includes('overflow-x-auto')) {
    result.warnings.push('Tables may not display properly on mobile devices');
    result.suggestions.push('Wrap tables in responsive containers or use simpler layouts for mobile');
  }
  
  return result;
}

function checkLongWords(content: string) {
  const result: ContentValidationCheckResult = { warnings: [], errors: [], suggestions: [] };
  
  // Extract text content
  const textContent = content.replace(/<[^>]*>/g, ' ');
  const words = textContent.split(/\s+/);
  
  const longWords = words.filter(word => word.length > 25);
  if (longWords.length > 0) {
    result.warnings.push('Very long words detected that may break mobile layout');
    result.suggestions.push('Consider breaking long words or using word-break CSS for mobile');
  }
  
  return result;
}

function checkEmbeddedContent(content: string) {
  const result: ContentValidationCheckResult = { warnings: [], errors: [], suggestions: [] };
  
  // Check for iframes (videos, embeds)
  if (content.includes('<iframe')) {
    result.warnings.push('Embedded content (iframes) should be responsive');
    result.suggestions.push('Wrap iframes in responsive containers with aspect-ratio classes');
  }
  
  return result;
}

function checkInlineStyles(content: string) {
  const result: ContentValidationCheckResult = { warnings: [], errors: [], suggestions: [] };
  
  // Check for inline styles that might break responsive design
  if (content.includes('style=')) {
    const styleMatches = content.match(/style="[^"]*"/gi) || [];
    for (const style of styleMatches) {
      if (style.includes('width:') && style.includes('px')) {
        result.warnings.push('Fixed pixel widths in inline styles may break mobile layout');
        result.suggestions.push('Use responsive units (%, rem, em) or Tailwind classes instead of fixed pixels');
        break;
      }
    }
  }
  
  return result;
}

function checkAccessibility(content: string) {
  const result: ContentValidationCheckResult = { warnings: [], errors: [], suggestions: [] };
  
  // Check for images without alt text
  const imgRegex = /<img[^>]*>/gi;
  const matches = content.match(imgRegex) || [];
  
  for (const img of matches) {
    if (!img.includes('alt=')) {
      result.warnings.push('Images should have alt text for accessibility');
      result.suggestions.push('Add descriptive alt attributes to all images');
      break;
    }
  }
  
  return result;
}

function addClassNameToTag(tag: string, className: string): string {
  if (/\sclass=(["'])/i.test(tag)) {
    return tag.replace(/\sclass=(["'])(.*?)\1/i, (_match, quote, existing) => {
      const classes = new Set(`${existing} ${className}`.split(/\s+/).filter(Boolean));
      return ` class=${quote}${Array.from(classes).join(' ')}${quote}`;
    });
  }

  return tag.replace(/>$/, ` class="${className}">`);
}

function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#160;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function escapeAttributeValue(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function getColSpan(cellOpenTag: string): number {
  const colSpan = cellOpenTag.match(/\scolspan=("|')?(\d+)\1/i)?.[2];
  const parsed = colSpan ? Number.parseInt(colSpan, 10) : 1;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
}

function addDataLabelToTdTag(tag: string, label: string): string {
  if (/\sdata-label=("|').*?\1/i.test(tag)) {
    return tag;
  }

  const safeLabel = escapeAttributeValue(label);
  return tag.replace(/>$/, ` data-label="${safeLabel}">`);
}

function hasClassName(tag: string, className: string): boolean {
  const classMatch = tag.match(/\sclass=("|')(.*?)\1/i);
  if (!classMatch) return false;

  const classes = classMatch[2]?.split(/\s+/).filter(Boolean) || [];
  return classes.includes(className);
}

function shouldHideGenericCardLabel(label: string): boolean {
  const normalized = label.trim().toLowerCase();
  return normalized === 'details'
    || normalized === 'detail'
    || normalized === 'value'
    || normalized === 'info'
    || normalized === 'information'
    || normalized === 'description';
}

function addMobileCardLabelsToTable(tableHtml: string): string {
  const rowRegex = /<tr\b[^>]*>[\s\S]*?<\/tr>/gi;
  const rows = tableHtml.match(rowRegex) || [];
  if (rows.length === 0) return tableHtml;

  const headerRow = rows.find((row) => /<th\b/i.test(row));
  const headerCells = headerRow?.match(/<th\b[^>]*>[\s\S]*?<\/th>/gi) || [];
  let headerLabels = headerCells
    .map((cell) => stripHtml(cell))
    .map((label) => label);

  let inferredHeaderRowIndex = -1;

  let hasValidHeaderRow = headerLabels.length > 0 && headerLabels.some((label) => label.length > 0);
  if (!hasValidHeaderRow) {
    // If table has no <th>, infer a header row from the first few data rows.
    type HeaderCandidate = {
      rowIndex: number;
      labels: string[];
      nonEmptyCount: number;
      score: number;
    };

    const candidates: HeaderCandidate[] = [];
    const maxScanRows = Math.min(rows.length, 4);

    for (let i = 0; i < maxScanRows; i += 1) {
      const row = rows[i];
      if (!row) continue;

      const tdCells = row.match(/<td\b[^>]*>[\s\S]*?<\/td>/gi) || [];
      if (tdCells.length <= 1) continue;

      const labels = tdCells.map((cell) => stripHtml(cell));
      const nonEmptyCount = labels.filter((label) => label.length > 0).length;
      if (nonEmptyCount < 2) continue;

      const score = (nonEmptyCount * 10) + (labels.length >= 3 ? 1 : 0) - i;
      candidates.push({ rowIndex: i, labels, nonEmptyCount, score });
    }

    const bestCandidate = candidates.sort((a, b) => b.score - a.score)[0];
    if (bestCandidate) {
      headerLabels = bestCandidate.labels;
      inferredHeaderRowIndex = bestCandidate.rowIndex;
      hasValidHeaderRow = true;
    }
  }

  if (!hasValidHeaderRow) {
    // Final fallback: still convert to cards and generate neutral labels for non-title columns.
    const maxCols = rows.reduce((max, row) => {
      const cellCount = (row.match(/<td\b[^>]*>[\s\S]*?<\/td>/gi) || []).length;
      return Math.max(max, cellCount);
    }, 0);

    if (maxCols <= 1) {
      return tableHtml;
    }

    headerLabels = Array.from({ length: maxCols }, (_unused, index) => (
      index === 0 ? '' : `Detail ${index}`
    ));
  }

  const tableTagMatch = tableHtml.match(/<table\b[^>]*>/i);
  let enhancedTableHtml = tableHtml;
  if (tableTagMatch && !hasClassName(tableTagMatch[0], 'content-table-mobile-cards')) {
    enhancedTableHtml = enhancedTableHtml.replace(/<table\b[^>]*>/i, (tableTag) => addClassNameToTag(tableTag, 'content-table-mobile-cards'));
  }

  let rowIndex = -1;
  return enhancedTableHtml.replace(rowRegex, (row) => {
    rowIndex += 1;

    if (rowIndex === inferredHeaderRowIndex) {
      return row.replace(/<tr\b[^>]*>/i, (trTag) => addClassNameToTag(trTag, 'content-table-mobile-header-row'));
    }

    let colIndex = 0;
    return row.replace(/<td\b[^>]*>[\s\S]*?<\/td>/gi, (tdCell) => {
      const openTagMatch = tdCell.match(/^<td\b[^>]*>/i);
      if (!openTagMatch) return tdCell;

      const openTag = openTagMatch[0];
      const colSpan = getColSpan(openTag);
      const rawLabel = headerLabels[colIndex] || '';
      let label = rawLabel.trim();
      const cellText = stripHtml(tdCell);

      if (colIndex > 0 && shouldHideGenericCardLabel(label)) {
        label = '';
      }

      let updatedTag = addDataLabelToTdTag(openTag, label);

      if (colIndex === 0) {
        updatedTag = addClassNameToTag(updatedTag, 'content-table-card-title');
      } else {
        updatedTag = addClassNameToTag(updatedTag, 'content-table-card-field');
      }

      if (label.length === 0) {
        updatedTag = addClassNameToTag(updatedTag, 'content-table-empty-label');
      }

      if (cellText.length === 0) {
        updatedTag = addClassNameToTag(updatedTag, 'content-table-empty-cell');
      }

      colIndex += colSpan;
      return tdCell.replace(openTag, updatedTag);
    });
  });
}

export function sanitizeAndOptimizeMobileContent(htmlContent: string): string {
  const optimizedHtml = htmlContent
    // Make images responsive
    .replace(/<img([^>]*?)>/gi, (match, attrs) => {
      if (!attrs.includes('class=')) {
        return `<img${attrs} class="max-w-full h-auto rounded mx-auto">`;
      }
      return match;
    })
    // Wrap tables for horizontal scroll
    .replace(/<table\b[^>]*>/gi, (tableTag) => `<div class="table-wrapper">${addClassNameToTag(tableTag, 'content-table')}`)
    .replace(/<\/table>/gi, '</table></div>')
    // Add responsive classes to table cells
    .replace(/<th\b[^>]*>/gi, (tag) => addClassNameToTag(tag, 'content-table-heading'))
    .replace(/<td\b[^>]*>/gi, (tag) => addClassNameToTag(tag, 'content-table-cell'))
    // Add per-cell labels so mobile can render table rows as cards with key/value layout.
    .replace(/<table\b[^>]*>[\s\S]*?<\/table>/gi, (table) => addMobileCardLabelsToTable(table))
    // Ensure proper spacing
    .replace(/\n/g, '<br />');

  // Make long words breakable without touching HTML tags/attributes such as href/src.
  return optimizedHtml
    .split(/(<[^>]+>)/g)
    .map((part) => (
      part.startsWith('<')
        ? part
        : part.replace(/(\w{20,})/g, '<span class="break-all">$1</span>')
    ))
    .join('');
}
