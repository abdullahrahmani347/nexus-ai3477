// Nexus AI Design System - Design Tokens
// Production-ready design system implementation

export const designTokens = {
  // Brand Colors (HSL values for CSS custom properties)
  colors: {
    brand: {
      nexusBlue: '218 100% 50%',      // #0066FF
      neuralPurple: '262 83% 58%',     // #6B46C1  
      connectionCyan: '188 95% 43%',   // #06B6D4
    },
    feedback: {
      success: '158 64% 52%',          // #10B981
      warning: '38 92% 50%',           // #F59E0B
      error: '0 72% 51%',              // #EF4444
    },
    neutral: {
      deepCharcoal: '210 22% 22%',     // #1F2937
      slateGray: '215 25% 27%',        // #64748B
      coolGray: '210 40% 98%',         // #F8FAFC
      pureWhite: '0 0% 100%',          // #FFFFFF
    }
  },

  // Typography Scale
  typography: {
    fontFamilies: {
      primary: "'Inter', system-ui, sans-serif",
      secondary: "'JetBrains Mono', monospace",
    },
    scale: {
      h1: { size: '48px', lineHeight: '56px', weight: '700' },
      h2: { size: '36px', lineHeight: '44px', weight: '600' },
      h3: { size: '24px', lineHeight: '32px', weight: '600' },
      h4: { size: '20px', lineHeight: '28px', weight: '500' },
      bodyLarge: { size: '18px', lineHeight: '28px', weight: '400' },
      body: { size: '16px', lineHeight: '24px', weight: '400' },
      small: { size: '14px', lineHeight: '20px', weight: '400' },
      caption: { size: '12px', lineHeight: '16px', weight: '400' },
    }
  },

  // Spacing Scale (4px base unit)
  spacing: {
    micro: '4px',    // 1 unit
    small: '8px',    // 2 units  
    medium: '16px',  // 4 units
    large: '24px',   // 6 units
    xl: '32px',      // 8 units
    xxl: '48px',     // 12 units
  },

  // Component Dimensions
  components: {
    heights: {
      small: '32px',
      medium: '40px',
      large: '48px',
    },
    radius: {
      small: '4px',
      medium: '8px',
      large: '12px',
      xl: '16px',
    }
  },

  // Shadow System
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },

  // Responsive Breakpoints
  breakpoints: {
    mobile: '320px',
    tablet: '768px', 
    desktop: '1024px',
    largeDesktop: '1440px',
  },

  // Animation Presets
  animations: {
    duration: {
      fast: '0.1s',
      normal: '0.2s',
      slow: '0.3s',
    },
    easing: {
      ease: 'cubic-bezier(0.4, 0, 0.2, 1)',
      easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
      easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    }
  }
} as const;

// Type exports for TypeScript
export type DesignTokens = typeof designTokens;
export type ColorScale = keyof typeof designTokens.colors;
export type TypographyScale = keyof typeof designTokens.typography.scale;
export type SpacingScale = keyof typeof designTokens.spacing;