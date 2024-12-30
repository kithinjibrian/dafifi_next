import ReactDOMServer from "react-dom/server";
import { Editor, Frame } from "@craftjs/core";

export const renderToHTML = (serializedState, components) => {
    const html = ReactDOMServer.renderToStaticMarkup(
        <Editor resolver={components} >
            <Frame data={serializedState} />
        </Editor>
    );

    return `<!DOCTYPE html>
<html>
<head>
  <title>Dafifi</title>
  <link rel="icon" href="https://app.dafifi.net/favicon.ico" type="image/x-icon"/>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
  ${html}
</body>
</html>`;
};