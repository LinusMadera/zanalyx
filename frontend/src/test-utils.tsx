import { render as rtlRender } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { getThemeByName } from './theme'

const theme = getThemeByName('shadTheme', 'light')

function render(ui: React.ReactElement, { route = '/' } = {}) {
  window.history.pushState({}, 'Test page', route)

  return rtlRender(
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {ui}
      </ThemeProvider>
    </BrowserRouter>
  )
}

export * from '@testing-library/react'
export { render } 