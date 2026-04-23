import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    const setThemeScript = `
      (function() {
        try {
          var theme = localStorage.getItem('invoice-app-theme') || 'dark';
          document.documentElement.dataset.theme = theme;
          if (theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        } catch (error) {}
      })();
    `;

    return (
      <Html lang="en">
        <Head>
          <meta
            name="description"
            content="Professional invoice app with CRUD, drafts, filtering, and theming"
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <body>
          <script dangerouslySetInnerHTML={{ __html: setThemeScript }} />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
