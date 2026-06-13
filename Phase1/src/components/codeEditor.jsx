import Editor from "@monaco-editor/react";

function CodeEditor({
  code,
  setCode,
  language,
}) {
  return (
    <div className="border rounded-lg overflow-hidden">
      <Editor
        height="500px"
        language={language}
        theme="vs-dark"
        value={code}
        onChange={(value) => setCode(value || "")}
      />
    </div>
  );
}

export default CodeEditor;