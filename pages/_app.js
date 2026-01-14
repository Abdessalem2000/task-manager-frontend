import '../src/App.css';

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <title>Task Manager</title>
        <meta name="description" content="Professional task management dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
