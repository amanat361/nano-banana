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
}

export interface EditingMode {
  id: string;
  title: string;
  description: string;
  emoji: string;
  basePrompt: string;
  primaryOptions: ModeOption[];
  advancedCategories?: ModeOptionCategory[];
}

export const EDITING_MODES: Record<string, EditingMode> = {
  companion: {
    id: 'companion',
    title: 'Add Companion',
    description: 'Add a boyfriend or girlfriend to your photo',
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
    ]
  },
  product: {
    id: 'product',
    title: 'Product Photo',
    description: 'Transform your photo into a professional product image',
    emoji: '📸',
    basePrompt: '',
    primaryOptions: [
      {
        id: 'white-bg',
        label: 'White Background',
        emoji: '⚪',
        promptModifier: 'remove the background and replace it with a clean white background'
      },
      {
        id: 'black-bg',
        label: 'Black Background', 
        emoji: '⚫',
        promptModifier: 'remove the background and replace it with a clean black background'
      }
    ],
    advancedCategories: [
      {
        id: 'enhancement',
        label: 'Enhancement',
        options: [
          {
            id: 'lighting',
            label: 'Lighting',
            emoji: '💡',
            promptModifier: 'improve the lighting to be more professional'
          },
          {
            id: 'shadows',
            label: 'Shadows',
            emoji: '🌫️',
            promptModifier: 'add realistic drop shadows'
          },
          {
            id: 'clarity',
            label: 'Sharpen',
            emoji: '🔍',
            promptModifier: 'enhance clarity and sharpness'
          }
        ]
      }
    ]
  }
};

export const getModeById = (id: string): EditingMode | undefined => {
  return EDITING_MODES[id];
};

export const getAllModes = (): EditingMode[] => {
  return Object.values(EDITING_MODES);
};