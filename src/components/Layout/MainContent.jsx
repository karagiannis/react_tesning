export default function MainContent({ children, hasPanel }) {
  return (
    <main
      className={`flex-1 overflow-y-auto transition-all duration-300 ${
        hasPanel ? 'mr-96' : ''
      }`}
    >
      {children}
    </main>
  );
}
