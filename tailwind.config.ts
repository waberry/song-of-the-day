import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import type { PluginAPI } from 'tailwindcss/types/config'

export default {
    darkMode: ["class"],
    content: ["./src/**/*.tsx"],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ["var(--font-geist-sans)", ...fontFamily.sans]
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
		},
		flipboard: {
			'0%': { transform: 'rotateX(0deg)' },
			'100%': { transform: 'rotateX(360deg)' },
		},
	},
	animation: {
		'flipboard': 'flipboard 0.6s cubic-bezier(0.455, 0.030, 0.515, 0.955)',
		'spin-slow': 'spin 3s linear infinite',
		bounce: 'bounce 1s infinite'
	},
	
  },
  plugins: [
    require("tailwind-scrollbar"),
    function ({ addUtilities }: PluginAPI) {
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
