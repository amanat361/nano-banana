// Import images
import companionBefore from '../images/companion-before.jpg';
import companionAfter from '../images/companion-after.jpg';
import productBefore from '../images/product-before.jpg';
import productAfter from '../images/product-after.jpg';
import styleBefore from '../images/style-before.jpg';
import styleAfter from '../images/style-after.jpg';
import customBefore from '../images/custom-before.jpg';
import customAfter from '../images/custom-after.jpg';

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

export interface CategoryGroup {
  id: string;
  label: string;
  icon: string;
  categories: ModeOptionCategory[];
}

export interface EditingMode {
  id: string;
  title: string;
  description: string;
  emoji: string;
  basePrompt: string;
  primaryOptions: ModeOption[];
  advancedCategories?: ModeOptionCategory[];
  categoryGroups?: CategoryGroup[];
  previewImages?: {
    before: string;
    after: string;
  };
  maxImages?: number;  // undefined/1 = single image, 2+ = multi-image mode
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
    categoryGroups: [
      {
        id: 'basics',
        label: 'Basics',
        icon: '⚡',
        categories: [
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
              },
              {
                id: 'goth',
                label: 'Goth',
                emoji: '🖤',
                promptModifier: 'goth aesthetic'
              },
              {
                id: 'egirl',
                label: 'E-girl',
                emoji: '🎮',
                promptModifier: 'e-girl aesthetic'
              },
              {
                id: 'trad',
                label: 'Trad',
                emoji: '🌸',
                promptModifier: 'traditional conservative style'
              }
            ]
          },
          {
            id: 'bodytype',
            label: 'Body Type',
            options: [
              {
                id: 'skinny',
                label: 'Skinny',
                emoji: '📏',
                promptModifier: 'skinny body type'
              },
              {
                id: 'fit',
                label: 'Fit',
                emoji: '💪',
                promptModifier: 'fit athletic body type'
              },
              {
                id: 'curvy',
                label: 'Curvy',
                emoji: '⏳',
                promptModifier: 'curvy body type'
              }
            ]
          }
        ]
      },
      {
        id: 'looks',
        label: 'Looks',
        icon: '👤',
        categories: [
          {
            id: 'race',
            label: 'Ethnicity',
            options: [
              {
                id: 'latino',
                label: 'Latino/a',
                emoji: '🇲🇽',
                promptModifier: 'Latino/Latina'
              },
              {
                id: 'asian',
                label: 'Asian',
                emoji: '🇯🇵',
                promptModifier: 'Asian'
              },
              {
                id: 'white',
                label: 'White',
                emoji: '🇺🇸',
                promptModifier: 'Caucasian'
              },
              {
                id: 'black',
                label: 'Black',
                emoji: '🇳🇬',
                promptModifier: 'Black'
              },
              {
                id: 'persian',
                label: 'Persian',
                emoji: '🇮🇷',
                promptModifier: 'Persian'
              },
              {
                id: 'mixed',
                label: 'Mixed',
                emoji: '🌍',
                promptModifier: 'mixed ethnicity'
              }
            ]
          },
          {
            id: 'haircolor',
            label: 'Hair Color',
            options: [
              {
                id: 'blonde',
                label: 'Blonde',
                emoji: '💛',
                promptModifier: 'blonde hair'
              },
              {
                id: 'brunette',
                label: 'Brunette',
                emoji: '🤎',
                promptModifier: 'brown hair'
              },
              {
                id: 'black',
                label: 'Black',
                emoji: '🖤',
                promptModifier: 'black hair'
              },
              {
                id: 'red',
                label: 'Red',
                emoji: '❤️',
                promptModifier: 'red hair'
              },
              {
                id: 'colorful',
                label: 'Colorful',
                emoji: '🌈',
                promptModifier: 'colorful hair'
              },
              {
                id: 'auburn',
                label: 'Auburn',
                emoji: '🟫',
                promptModifier: 'auburn hair'
              }
            ]
          },
          {
            id: 'eyecolor',
            label: 'Eye Color',
            options: [
              {
                id: 'blue',
                label: 'Blue',
                emoji: '💙',
                promptModifier: 'blue eyes'
              },
              {
                id: 'brown',
                label: 'Brown',
                emoji: '🤎',
                promptModifier: 'brown eyes'
              },
              {
                id: 'green',
                label: 'Green',
                emoji: '💚',
                promptModifier: 'green eyes'
              },
              {
                id: 'hazel',
                label: 'Hazel',
                emoji: '🟤',
                promptModifier: 'hazel eyes'
              },
              {
                id: 'gray',
                label: 'Gray',
                emoji: '🩶',
                promptModifier: 'gray eyes'
              },
              {
                id: 'amber',
                label: 'Amber',
                emoji: '🟠',
                promptModifier: 'amber eyes'
              }
            ]
          }
        ]
      },
      {
        id: 'extras',
        label: 'Extras',
        icon: '🎯',
        categories: [
          {
            id: 'age',
            label: 'Age',
            options: [
              {
                id: 'young',
                label: '20-30s',
                emoji: '🧒',
                promptModifier: 'young'
              },
              {
                id: 'adult',
                label: '40-50s',
                emoji: '🧑',
                promptModifier: 'middle-aged'
              },
              {
                id: 'old',
                label: '60-70s',
                emoji: '👴',
                promptModifier: 'old'
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
  },
  coupleMashup: {
    id: 'coupleMashup',
    title: 'Couple Mashup',
    description: 'See what two people would look like as a couple',
    emoji: '💕',
    basePrompt: 'Create a realistic photo of these two people as a romantic couple.',
    maxImages: 2,
    primaryOptions: [
      { id: 'romantic', label: 'Romantic', emoji: '💑', promptModifier: 'Show them in a romantic pose' },
      { id: 'wedding', label: 'Wedding', emoji: '💒', promptModifier: 'Show them at their wedding' },
      { id: 'casual', label: 'Casual', emoji: '🤝', promptModifier: 'Show them relaxed and happy together' }
    ],
    advancedCategories: [
      {
        id: 'setting',
        label: 'Setting',
        options: [
          { id: 'beach', label: 'Beach', emoji: '🏖️', promptModifier: 'at the beach' },
          { id: 'cafe', label: 'Cafe', emoji: '☕', promptModifier: 'in a cozy cafe' },
          { id: 'park', label: 'Park', emoji: '🌳', promptModifier: 'in a beautiful park' }
        ]
      }
    ],
    previewImages: {
      before: companionBefore,
      after: companionAfter
    }
  }
};

export const getModeById = (id: string): EditingMode | undefined => {
  return EDITING_MODES[id];
};

export const getAllModes = (): EditingMode[] => {
  return Object.values(EDITING_MODES);
};