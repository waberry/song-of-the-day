import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
    darkMode: ["class"],
    // content: ["./src/**/*.tsx"],
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	  ],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ["var(--font-sans)", ...fontFamily.sans]
  		},
  		animation: {
  			'spin-slow': 'spin 3s linear infinite',
  			bounce: 'bounce 1s infinite'
  		},
  		backgroundImage: {
  			'gradient-fade': 'linear-gradient(to bottom, transparent, white)'
  		},
  		keyframes: {
  			spin: {
  				'0%': {
  					transform: 'translateY(-50%) rotate(0deg)'
  				},
  				'100%': {
  					transform: 'translateY(-50%) rotate(360deg)'
  				}
  			},
  			bounce: {
  				'0%, 100%': {
  					transform: 'translateY(-25%)',
  					animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
  				},
  				'50%': {
  					transform: 'translateY(0)',
  					animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
  				}
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		}
  	}
  },
  plugins: [
    require("tailwind-scrollbar"),
    function ({ addUtilities }) {
      const newUtilities = {
        ".mask-linear-gradient": {
          "mask-image":
            "linear-gradient(to bottom, black calc(100% - 64px), transparent 100%)",
          "-webkit-mask-image":
            "linear-gradient(to bottom, black calc(100% - 64px), transparent 100%)",
        },
      };
      addUtilities(newUtilities, ["responsive", "hover"]);
    },
      require("tailwindcss-animate")
],
  variants: {
    scrollbar: ["rounded"],
  },
} satisfies Config;
