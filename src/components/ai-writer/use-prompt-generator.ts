// Define the instruction types
export type InstructionType =
  | 'improve_writing'
  | 'continue_writing'
  | 'fix_spelling_grammar'
  | 'explain'
  | 'make_longer'
  | 'make_shorter'
  | 'rewrite';

// Define the prompt parameters interface
export interface PromptParams {
  originalText?: string;
  userInput?: string;
  instructionType?: InstructionType;
  previousResponse?: string;
}

/**
 * Hook for generating AI prompts based on different parameters
 * @returns An object containing the function to generate prompts
 */
export function usePromptGenerator() {

  /**
   * Generates base prompt with context from original text and user input
   */
  const generateBasePrompt = (originalText?: string, userInput?: string): string => {
    let prompt = 'You are an advanced AI assistant specialized in text processing. ';

    if(originalText && userInput) {
      prompt += `Process the following original text according to the user's requirements.\n\nORIGINAL TEXT:\n"${originalText}"\n\nUSER REQUIREMENTS:\n${userInput}\n\n`;
    } else if(originalText) {
      prompt += `Process the following text:\n\n"${originalText}"\n\n`;
    } else if(userInput) {
      prompt += `Create content based on the following user requirements:\n\nUSER REQUIREMENTS:\n${userInput}\n\n`;
    } else {
      prompt += 'Provide appropriate assistance based on the selected function.\n\n';
    }

    return prompt;
  };

  /**
   * Generates prompt for improving writing
   */
  const improveWritingPrompt = (originalText?: string, userInput?: string): string => {
    let prompt = 'Improve the provided text to make it clearer, more coherent, and more professional. ';

    if(userInput) {
      prompt += `Pay special attention to the following requirements: ${userInput}. `;
    }

    if(!originalText) {
      prompt += 'If no original text is provided, kindly ask for content to improve. ';
    }

    prompt += 'Maintain the core meaning while enhancing quality, expression, and structure. Improve flow, logic, and precision of language.\n\n';

    return prompt;
  };

  /**
   * Generates prompt for continuing writing
   */
  const continueWritingPrompt = (originalText?: string, userInput?: string): string => {
    let prompt = 'Continue the provided text in a natural and seamless way. ';

    if(userInput) {
      prompt += `Follow these specific guidelines: ${userInput}. `;
    }

    if(!originalText) {
      prompt += 'If no original text is provided, kindly ask for content to continue from. ';
    }

    prompt += 'Maintain consistent style, tone, and narrative perspective to create a natural extension of the original content. Ensure smooth transition from the existing text.\n\n';

    return prompt;
  };

  /**
   * Generates prompt for fixing spelling and grammar
   */
  const fixSpellingGrammarPrompt = (originalText?: string): string => {
    let prompt = 'Fix only spelling errors, grammatical issues, and punctuation in the text. Do not alter the style, content, or expression. ';

    if(!originalText) {
      prompt += 'If no original text is provided, kindly ask for content to correct. ';
    }

    prompt += 'List all changes made and briefly explain each correction to help the user learn from the fixes.\n\n';

    return prompt;
  };

  /**
   * Generates prompt for explaining text
   */
  const explainPrompt = (originalText?: string, userInput?: string): string => {
    let prompt = 'Explain the provided text to make it easier to understand. ';

    if(userInput) {
      prompt += `Adjust the level of detail and complexity according to: ${userInput}. `;
    }

    if(!originalText) {
      prompt += 'If no original text is provided, kindly ask for content to explain. ';
    }

    prompt += 'Provide a concise explanation, break down complex concepts, clarify terminology, and offer relevant background information when needed. Use simple, direct language while maintaining accuracy.\n\n';

    return prompt;
  };

  /**
   * Generates prompt for making text longer
   */
  const makeLongerPrompt = (originalText?: string, userInput?: string): string => {
    let prompt = 'Expand the provided text to make it more detailed and comprehensive. ';

    if(userInput) {
      prompt += `Follow these expansion guidelines: ${userInput}. `;
    }

    if(!originalText) {
      prompt += 'If no original text is provided, kindly ask for content to expand. ';
    }

    prompt += 'Add details, examples, background information, or supporting data. Elaborate on existing points, add relevant subtopics, or provide additional evidence. Ensure added content is relevant and enhances rather than dilutes the value of the original information.\n\n';

    return prompt;
  };

  /**
   * Generates prompt for making text shorter
   */
  const makeShorterPrompt = (originalText?: string, userInput?: string): string => {
    let prompt = 'Condense the provided text while preserving core information and reducing word count. ';

    if(userInput) {
      prompt += `Adjust the level of condensation according to: ${userInput}. `;
    }

    if(!originalText) {
      prompt += 'If no original text is provided, kindly ask for content to condense. ';
    }

    prompt += 'Remove redundancies, merge similar points, replace verbose passages with concise expressions. Retain all important information and key arguments while significantly reducing overall length. The result should be a more concise version without loss of essential information.\n\n';

    return prompt;
  };

  /**
   * Generates prompt for rewriting text
   */
  const rewritePrompt = (originalText?: string, userInput?: string, previousResponse?: string): string => {

    let prompt = `Generate a new version of the response for the provided context. `;

    if(userInput) {
      prompt += `Follow these specific guidelines: ${userInput}. `;
    }

    if(!originalText) {
      prompt += 'If no original text is provided, kindly ask for content to rewrite. ';
    }

    if(previousResponse) {
      prompt += `The previous response was:\n\n"${previousResponse}"\n\n`;
    }

    prompt += 'Create a fresh response with a different approach, style, or perspective. Maintain relevance to the context while offering a unique take on the subject. Avoid repeating the same content or structure.\n\n';

    return prompt;
  };

  /**
   * Generates prompt section to avoid repetition with previous response
   */
  const generateContinuityPrompt = (previousResponse: string): string => {
    return `I have previously generated the following content:\n\n"${previousResponse}"\n\nPlease provide new, different content and avoid repeating the above response. You may reference, improve, extend, or take a different approach, but do not simply duplicate previous content.\n\n`;
  };

  /**
   * Generates closing instructions
   */
  const generateClosingPrompt = (): string => {
    return '\nMaintain a professional, clear, and helpful tone throughout your response. Adapt to the user\'s needs and the provided context. If critical information is missing, politely request additional details from the user.';
  };

  /**
   * Generates instruction-specific prompt based on instruction type
   */
  const generateInstructionPrompt = (
    instructionType: InstructionType,
    originalText?: string,
    userInput?: string,
    previousResponse?: string,
  ): string => {
    switch(instructionType) {
      case 'improve_writing':
        return improveWritingPrompt(originalText, userInput);
      case 'continue_writing':
        return continueWritingPrompt(originalText, userInput);
      case 'fix_spelling_grammar':
        return fixSpellingGrammarPrompt(originalText);
      case 'explain':
        return explainPrompt(originalText, userInput);
      case 'make_longer':
        return makeLongerPrompt(originalText, userInput);
      case 'make_shorter':
        return makeShorterPrompt(originalText, userInput);
      case 'rewrite':
        return rewritePrompt(originalText, userInput, previousResponse);
      default:
        return '';
    }
  };

  /**
   * Main function to generate the complete prompt based on all parameters
   */
  const generatePrompt = (params: PromptParams): string => {
    const {
      originalText,
      userInput,
      instructionType,
      previousResponse,
    } = params;

    // Build base prompt
    let prompt = generateBasePrompt(originalText, userInput);

    // Add instruction-specific prompt if available
    if(instructionType) {
      prompt += generateInstructionPrompt(instructionType, originalText, userInput, previousResponse);
    }

    // Add continuity guidance if there's a previous response
    if(previousResponse) {
      prompt += generateContinuityPrompt(previousResponse);
    }

    // Add closing instructions
    prompt += generateClosingPrompt();

    return prompt;
  };

  return { generatePrompt };
}