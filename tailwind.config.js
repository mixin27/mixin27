/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
	container: {
		center: true,
		padding: '15px',
		screens: {
			"sm": "640px",
			"md": "768px",
			"lg": "960px",
			"xl": "1200px",
		},
	},
	fontFamily: {
		primary: "var(--font-jetbrainsMono)",
	},
  	extend: {
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
			primary: '#1c1c22',
			accent: {
				DEFAULT: '#00ff99',
				hover: '#00e187',
			},
		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
