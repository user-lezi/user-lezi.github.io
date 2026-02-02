export function uwuifyText(text: string): string {
  let out = text;

  // r/l → w
  out = out.replace(/[rl]/g, "w").replace(/[RL]/g, "W");

  // n + vowel → ny
  out = out.replace(/\bn([aeiou])/gi, "ny$1");

  // soft stutters
  out = out.replace(/\b([a-z])/gi, (m, p1) =>
    Math.random() < 0.1 ? `${p1}-${m}` : m,
  );

  // punctuation flavor
  out = out.replace(/!+/g, () => {
    const faces = [" uwu!", " owo!", " >_<!", " 😳!"];
    return faces[Math.floor(Math.random() * faces.length)];
  });

  return out;
}
