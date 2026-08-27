import Editor from "@monaco-editor/react";

function CodeEditor({ code, setCode, language, height = "100%" }) {
  return (
    <div className="h-full overflow-hidden">
      <Editor
        key={language}
        height={height}
        language={language}
        theme="hc-black"
        value={code}
        onChange={(value) => setCode(value || "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 12 },
          tabSize: 2,
          wordWrap: "on",
          fontFamily: "'Geist Variable', 'Fira Code', monospace",
        }}
      />
    </div>
  );
}

export default CodeEditor;
