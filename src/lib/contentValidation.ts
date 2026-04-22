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

export function sanitizeAndOptimizeMobileContent(htmlContent: string): string {
  return htmlContent
    // Make images responsive
    .replace(/<img([^>]*?)>/gi, (match, attrs) => {
      if (!attrs.includes('class=')) {
        return `<img${attrs} class="max-w-full h-auto rounded mx-auto">`;
      }
      return match;
    })
    // Wrap tables for horizontal scroll
    .replace(/<table([^>]*?)>/gi, '<div class="overflow-x-auto"><table$1 class="min-w-full border-collapse border border-gray-300">')
    .replace(/<\/table>/gi, '</table></div>')
    // Add responsive classes to table cells
    .replace(/<th([^>]*?)>/gi, '<th$1 class="border border-gray-300 px-2 py-1 bg-gray-50 text-left text-sm">')
    .replace(/<td([^>]*?)>/gi, '<td$1 class="border border-gray-300 px-2 py-1 text-sm">')
    // Make long words breakable
    .replace(/(\w{20,})/g, '<span class="break-all">$1</span>')
    // Ensure proper spacing
    .replace(/\n/g, '<br />');
}
