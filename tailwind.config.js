// Source - https://stackoverflow.com/a
// Posted by rottitime, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-20, License - CC BY-SA 4.0

/** @type {import('tailwindcss').Config} */

export default {

    theme: {

        extend: {

            fontFamily: {

                "hb75": "var(--font-hb75)", // note: you can call the left side of this whatever you want - barlow-bold or title-font or foo-bar, this is what you'll use in your Tailwind css classes to use this font

                "inter-medium": "var(--font-inter)", // note: the bit that goes inside the var() function is the same variable name we defined in app.tsx

            }

        }

    }
}
