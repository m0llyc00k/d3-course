const { amber } = require('tailwindcss/colors');

module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}', './src/lib/data/copy.json'],
	plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
	theme: {
		screens: {
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1280px',
			'2xl': '1536px'
		},
		fontFamily: {
			sans: ['Inter', 'sans-serif']
		},
		fontSize: {
			xs: ['0.75rem'],
			sm: ['0.875rem'],
			base: ['1rem'],
			lg: ['1.125rem'],
			xl: ['1.3125rem'],
			'2xl': ['1.125rem'],
			'3xl': ['2rem'],
			'4xl': ['2.25rem'],
			'5xl': ['3rem'],
			'6xl': ['4rem'],
			'7xl': ['4.5rem'],
			'8xl': ['6rem'],
			'9xl': ['8rem']
		},

		extend: {
			colors: {
				background: amber['50'],
				white: {
					DEFAULT: '#FFFFFF',
					off: '#F9F9F9'
				},
				black: {
					DEFAULT: '#010101',
					light: '#121212'
				},
				primary: {
					light: '#00CCB3', //df light
					DEFAULT: '#234C5E' // df navy,
				},
				secondary: {
					light: amber['100'],
					DEFAULT: amber['300']
				},
				map: {
					blue: '#3b528b',
					yellow: '#fde725',
					purple: '#440154',
					teal: '#21908d',
					green: '#5dc963'
			}
			}
		}
	}
};
