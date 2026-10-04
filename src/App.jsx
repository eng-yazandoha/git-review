import ReloadPrompt from './components/ReloadPrompt'

function App() {
  return (
    <div>
      <h1>Git Learning Project</h1>
      <h2>this is update1</h2>
      <button onClick={() => alert("Hello Git!")}>
        Click Me
      </button>
      <p>New feature button added!2222</p>
      <h2>this is the update2</h2>

      <ReloadPrompt />
    </div>
  );
}

export default App;