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

function isBlankTableCell(cellHtml: string): boolean {
  const text = cellHtml
    .replace(/<br\s*\/?>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&#160;/g, ' ')
    .trim();

  return text.length === 0;
}

function removeExplicitTableWidth(tableTag: string): string {
  return tableTag.replace(/\sstyle=(["'])(.*?)\1/i, (match, quote, styleValue) => {
    const cleanedStyle = styleValue
      .split(';')
      .map((rule: string) => rule.trim())
      .filter((rule: string) => rule && !/^width\s*:/i.test(rule))
      .join('; ');

    return cleanedStyle ? ` style=${quote}${cleanedStyle}${quote}` : '';
  });
}

function removeTrailingEmptyTableColumns(tableHtml: string): string {
  const rowRegex = /<tr\b[^>]*>[\s\S]*?<\/tr>/gi;
  const rows = tableHtml.match(rowRegex) || [];
  if (rows.length === 0) return tableHtml;

  const parsedRows = rows.map((row) => row.match(/<t[dh]\b[^>]*>[\s\S]*?<\/t[dh]>/gi) || []);
  if (parsedRows.some((cells) => cells.length === 0)) return tableHtml;

  const columnCount = Math.max(...parsedRows.map((cells) => cells.length));
  if (columnCount <= 1 || parsedRows.some((cells) => cells.length !== columnCount)) return tableHtml;

  const hasMergedCells = parsedRows.some((cells) =>
    cells.some((cell) => {
      const colSpan = cell.match(/\scolspan=(["']?)(\d+)\1/i)?.[2];
      const rowSpan = cell.match(/\srowspan=(["']?)(\d+)\1/i)?.[2];
      return (colSpan && Number(colSpan) > 1) || (rowSpan && Number(rowSpan) > 1);
    })
  );
  if (hasMergedCells) return tableHtml;

  const columnsToRemove: number[] = [];
  for (let colIndex = columnCount - 1; colIndex >= 0; colIndex -= 1) {
    const isEmptyColumn = parsedRows.every((cells) => isBlankTableCell(cells[colIndex]));
    if (!isEmptyColumn) break;
    columnsToRemove.push(colIndex);
  }

  if (columnsToRemove.length === 0) return tableHtml;

  let cleanedTable = tableHtml;

  rows.forEach((row, rowIndex) => {
    const cells = [...parsedRows[rowIndex]];
    columnsToRemove.forEach((colIndex) => {
      cells.splice(colIndex, 1);
    });
    cleanedTable = cleanedTable.replace(row, row.replace(/<t[dh]\b[^>]*>[\s\S]*?<\/t[dh]>/gi, () => cells.shift() || ''));
  });

  const colgroupMatch = cleanedTable.match(/<colgroup\b[^>]*>[\s\S]*?<\/colgroup>/i);
  if (colgroupMatch) {
    const cols = colgroupMatch[0].match(/<col\b[^>]*>/gi) || [];
    if (cols.length === columnCount) {
      columnsToRemove.forEach((colIndex) => {
        cols.splice(colIndex, 1);
      });
      cleanedTable = cleanedTable.replace(colgroupMatch[0], `<colgroup>${cols.join('')}</colgroup>`);
    }
  }

  return cleanedTable.replace(/<table\b[^>]*>/i, (tableTag) => removeExplicitTableWidth(tableTag));
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

export function sanitizeAndOptimizeMobileContent(htmlContent: string): string {
  const optimizedHtml = htmlContent
    // Make images responsive
    .replace(/<img([^>]*?)>/gi, (match, attrs) => {
      if (!attrs.includes('class=')) {
        return `<img${attrs} class="max-w-full h-auto rounded mx-auto">`;
      }
      return match;
    })
    // Remove accidental trailing empty columns from editor tables before rendering.
    .replace(/<table\b[^>]*>[\s\S]*?<\/table>/gi, (table) => removeTrailingEmptyTableColumns(table))
    // Wrap tables for horizontal scroll
    .replace(/<table\b[^>]*>/gi, (tableTag) => `<div class="overflow-x-auto">${addClassNameToTag(tableTag, 'content-table')}`)
    .replace(/<\/table>/gi, '</table></div>')
    // Add responsive classes to table cells
    .replace(/<th\b[^>]*>/gi, (tag) => addClassNameToTag(tag, 'content-table-heading'))
    .replace(/<td\b[^>]*>/gi, (tag) => addClassNameToTag(tag, 'content-table-cell'))
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
