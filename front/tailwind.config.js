module.exports = {
  mode: 'jit',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}", "./src/**/*.{png,svg}"],
  theme: {
    extend: {
      backgroundImage: (theme) => ({
        "arrow-right": "url('../img/arrow-right.svg')",
        "arrow-left" : "url('../img/arrow-left.svg')",
      }),
      gridTemplateColumns: {
        '20' : 'repeat(20, minmax(0, 1fr))',
      }
    },
  },
  plugins: [],
}
