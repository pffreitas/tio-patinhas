import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #eee;
    font-family: "Roboto","Helvetica","Arial",sans-serif;
    -webkit-font-smoothing: antialiased;
  }
`
