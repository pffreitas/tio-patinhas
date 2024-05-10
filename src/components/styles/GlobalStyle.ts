import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #f9f9f9;
    font-family: "Roboto","Helvetica","Arial",sans-serif;
    -webkit-font-smoothing: antialiased;
  }
`
