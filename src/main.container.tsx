import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import MainMenu from "./components/MainMenu";
import ImageSlider from "./components/ImageSlider/ImageSlider";

type IProps = Record<string, never>;

interface IState {
  selectedFolders: string[] | null;
  noRepeat: boolean;
}

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

export default class Main extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedFolders: null,
      noRepeat: false,
    };
  }

  onDirSelected = (dirs: string[], noRepeat: boolean) => {
    this.setState({ selectedFolders: dirs, noRepeat });
  };

  returnToMainMenu = () => this.setState({ selectedFolders: null });

  render() {
    return (
      <ThemeProvider theme={darkTheme}>
        {this.state.selectedFolders?.length ? (
          <ImageSlider
            folders={this.state.selectedFolders}
            noRepeat={this.state.noRepeat}
            onStop={this.returnToMainMenu}
          />
        ) : (
          <MainMenu onDirSelected={this.onDirSelected} />
        )}
      </ThemeProvider>
    );
  }
}
