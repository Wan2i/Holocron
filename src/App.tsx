import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  async function runBackendTest() {
    try {
      const subject: any = await invoke("create_subject", {
        code: "CSC510",
        name: "Discrete Structures",
        color: "#4f46e5",
      });
      console.log("created subject:", subject);

      const subjects = await invoke("get_subjects");
      console.log("all subjects:", subjects);

      const category = await invoke("get_category");
      console.log("all categories:", category);

      const task: any = await invoke("create_task", {
        title: "Assignment 1",
        dueDate: "2026-08-25",
        completed: 0,
        sId: subject.s_id,
        cId: 1,
      });
      console.log("created task:", task);

      const note: any = await invoke("create_notes", {
        sId: subject.s_id,
        chapter: 1,
        name: "Intro",
        filePath: "C:\\test\\ch1.pdf",
      });
      console.log("created note:", note);
    } catch (err) {
      console.error("backend test failed:", err);
    }
  }

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vite.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>

      <button onClick={runBackendTest}>Run backend test</button>
    </main>
  );
}

export default App;