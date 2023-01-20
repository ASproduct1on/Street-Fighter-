const presets = [
  [
    "@babel/preset-env",
    {
      targets: {
        firefox: "60",
        chrome: "67"
      }
    }
  ]
];

module.exports = { presets };
