module.exports = {
  "*.{js,jsx,ts,tsx}": ["eslint --fix"],
  "*.{css,scss,sass}": ["stylelint --fix"],
  "*.{json,md,html,yml,yaml}": ["prettier --write"],
  "*.ts": () => "tsc -p tsconfig.json --noEmit --incremental false",
};
