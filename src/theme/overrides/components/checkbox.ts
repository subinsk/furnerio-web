// ----------------------------------------------------------------------

export function checkbox(theme: any) {
  return {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          padding: theme.spacing(1),
        },
      },
    },
  };
}
