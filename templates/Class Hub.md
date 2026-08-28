<%*
let vocabRoot = "content/1. Exploring Computer Science/Vocabulary";
let allFiles = app.vault.getMarkdownFiles();

// Get immediate subfolders of the vocab root
let subfolders = new Set();
allFiles.forEach(f => {
  if (f.path.startsWith(vocabRoot + "/")) {
    let rest = f.path.slice(vocabRoot.length + 1);
    let parts = rest.split("/");
    if (parts.length > 1) {
      subfolders.add(parts[0]);
    }
  }
});

let links = Array.from(subfolders).sort().map(sub => `- [[${sub}]]`).join("\n");
tR += links || "*(no subfolders found)*";
%>