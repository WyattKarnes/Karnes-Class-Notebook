<%*
let currentFile = tp.file.path(true);
let currentFolder = currentFile.substring(0, currentFile.lastIndexOf("/"));

let files = app.vault.getMarkdownFiles()
  .filter(f => f.path.startsWith(currentFolder + "/") && f.path !== currentFile);

let links = files.map(f => `- [[${f.basename}]]`).join("\n");
tR += links || "*(no notes found)*";
%>