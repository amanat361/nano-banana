// Import images
import companionBefore from '../images/companion-before.jpeg';
import companionAfter from '../images/companion-after.jpeg';
import productBefore from '../images/product-before.jpg';
import productAfter from '../images/product-after.png';
import styleBefore from '../images/style-before.jpg';
import styleAfter from '../images/style-after.png';
import customBefore from '../images/custom-before.png';
import customAfter from '../images/custom-after.png';

export interface ModeOption {
  id: string;
  label: string;
  emoji: string;
  promptModifier: string;
}

export interface ModeOptionCategory {
  id: string;
  label: string;
  options: ModeOption[];
  isCustom?: boolean;
}

export interface EditingMode {
  id: string;
  title: string;
  description: string;
  emoji: string;
  basePrompt: string;
  primaryOptions: ModeOption[];
  advancedCategories?: ModeOptionCategory[];
  previewImages?: {
    before: string;
    after: string;
  };
}

export const EDITING_MODES: Record<string, EditingMode> = {
  companion: {
    id: 'companion',
    title: 'Add Companion',
    description: 'Give yourself the partner you deserve',
    emoji: '💑',
    basePrompt: '',
    primaryOptions: [
      {
        id: 'boyfriend',
        label: 'Add Boyfriend',
        emoji: '👨',
        promptModifier: 'add a boyfriend'
      },
      {
        id: 'girlfriend',
        label: 'Add Girlfriend',
        emoji: '👩',
        promptModifier: 'add a girlfriend'
      }
    ],
    advancedCategories: [
      {
        id: 'age',
        label: 'Age',
        options: [
          {
            id: 'young',
            label: 'Young',
            emoji: '🧒',
            promptModifier: 'young'
          },
          {
            id: 'adult',
            label: 'Adult',
            emoji: '🧑',
            promptModifier: 'middle-aged'
          },
          {
            id: 'old',
            label: 'Old',
            emoji: '👴',
            promptModifier: 'old'
          }
        ]
      },
      {
        id: 'style',
        label: 'Style',
        options: [
          {
            id: 'casual',
            label: 'Casual',
            emoji: '👕',
            promptModifier: 'casual'
          },
          {
            id: 'formal',
            label: 'Formal',
            emoji: '👔',
            promptModifier: 'formal'
          },
          {
            id: 'athletic',
            label: 'Athletic',
            emoji: '🏃',
            promptModifier: 'athletic'
          }
        ]
      },
      {
        id: 'setting',
        label: 'Setting',
        options: [
          {
            id: 'beach',
            label: 'Beach',
            emoji: '🏖️',
            promptModifier: 'at the beach'
          },
          {
            id: 'cafe',
            label: 'Cafe',
            emoji: '☕',
            promptModifier: 'in a coffee shop'
          },
          {
            id: 'park',
            label: 'Park',
            emoji: '🌳',
            promptModifier: 'in a park'
          }
        ]
      }
    ],
    previewImages: {
      before: companionBefore,
      after: companionAfter
    }
  },
  product: {
    id: 'product',
    title: 'Product Photo',
    description: 'Turn your photo into a professional product image',
    emoji: '📸',
    basePrompt: 'turn this image into a professional product photo,',
    primaryOptions: [
      {
        id: 'white-bg',
        label: 'White BG',
        emoji: '⚪',
        promptModifier: 'also remove the background and replace it with a clean white background'
      },
      {
        id: 'black-bg',
        label: 'Black BG', 
        emoji: '⚫',
        promptModifier: 'also remove the background and replace it with a clean black background'
      },
      {
        id: 'auto-bg',
        label: 'Auto BG',
        emoji: '🌳',
        promptModifier: 'also remove the background and replace it with a clean background as if it was a professional photo shoot'
      }
    ],
    advancedCategories: [
      {
        id: 'enhancement',
        label: 'Enhancement',
        options: [
          {
            id: 'ad',
            label: 'Advert',
            emoji: '💡',
            promptModifier: 'make it look like an advert for the product, do not include any text'
          },
          {
            id: 'text',
            label: 'Add Text',
            emoji: '🌫️',
            promptModifier: 'add stylish text to the image'
          },
          {
            id: 'clarity',
            label: 'Sharpen',
            emoji: '🔍',
            promptModifier: 'enhance clarity and sharpness'
          }
        ]
      }
    ],
    previewImages: {
      before: productBefore,
      after: productAfter
    }
  },
  style: {
    id: 'style',
    title: 'Change Style',
    description: 'Transform your photo into different artistic styles',
    emoji: '🎨',
    basePrompt: 'change the style of this image to',
    primaryOptions: [
      {
        id: 'ghibli',
        label: 'Ghibli',
        emoji: '🌸',
        promptModifier: 'Studio Ghibli animation style'
      },
      {
        id: 'pixar',
        label: 'Pixar',
        emoji: '🎬',
        promptModifier: 'Pixar 3D animation style'
      },
      {
        id: 'sketch',
        label: 'Sketch',
        emoji: '✏️',
        promptModifier: 'pencil sketch drawing'
      }
    ],
    advancedCategories: [
      {
        id: 'animation',
        label: 'Animation',
        options: [
          {
            id: 'disney',
            label: 'Disney',
            emoji: '🏰',
            promptModifier: 'classic Disney animation style'
          },
          {
            id: 'anime',
            label: 'Anime',
            emoji: '👘',
            promptModifier: 'Japanese anime style'
          },
          {
            id: 'cartoon',
            label: 'Cartoon',
            emoji: '🎪',
            promptModifier: 'cartoon illustration style'
          }
        ]
      },
      {
        id: 'art',
        label: 'Art Style',
        options: [
          {
            id: 'watercolor',
            label: 'Watercolor',
            emoji: '🎨',
            promptModifier: 'watercolor painting style'
          },
          {
            id: 'oil',
            label: 'Oil Paint',
            emoji: '🖼️',
            promptModifier: 'oil painting style'
          },
          {
            id: 'pencil',
            label: 'Pencil',
            emoji: '✏️',
            promptModifier: 'detailed pencil drawing style'
          }
        ]
      }
    ],
    previewImages: {
      before: styleBefore,
      after: styleAfter
    }
  },
  custom: {
    id: 'custom',
    title: 'Custom Edit',
    description: 'Tell the AI exactly what you want with your photo',
    emoji: '✏️',
    basePrompt: '',
    primaryOptions: [],
    previewImages: {
      before: customBefore,
      after: customAfter
    }
  }
};

export const getModeById = (id: string): EditingMode | undefined => {
  return EDITING_MODES[id];
};

export const getAllModes = (): EditingMode[] => {
  return Object.values(EDITING_MODES);
};