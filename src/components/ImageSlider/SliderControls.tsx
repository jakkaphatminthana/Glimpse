import { Box, IconButton } from "@mui/material";
import NextIcon from "@mui/icons-material/SkipNextRounded";
import PreviousIcon from "@mui/icons-material/SkipPreviousRounded";
import StopIcon from "@mui/icons-material/StopRounded";
import Fullscreen from "@mui/icons-material/Fullscreen";
import FullscreenExit from "@mui/icons-material/FullscreenExit";
import React from "react";

interface IProps {
  onPreviousImage(): void;
  onNextImage(): void;
  onStop(): void;
}

interface IState {
  isFullscreen: boolean;
  activatedFullscreen: boolean;
}

export default class SliderControls extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      isFullscreen: false,
      activatedFullscreen: false,
    };
  }

  async componentDidMount(): Promise<void> {
    document.addEventListener("keydown", this.handleKeyPress);
    const isFullscreen = await window.funcs.isFullscreen();
    this.setState({ isFullscreen });
    window.funcs.addFullscreenEventHandler(this.updateFullscreenValue);
  }

  componentWillUnmount(): void {
    document.removeEventListener("keydown", this.handleKeyPress);
    window.funcs.removeFullscreenEventHandler(this.updateFullscreenValue);
    if (this.state.activatedFullscreen && this.state.isFullscreen)
      window.funcs.setFullscreen(false);
  }

  updateFullscreenValue = (isEnabled: boolean): void => {
    this.setState({ isFullscreen: isEnabled });
  };

  toggleFullscreen = async (): Promise<void> => {
    const isFullscreen = await window.funcs.isFullscreen();
    if (!isFullscreen) {
      if (!this.state.activatedFullscreen)
        this.setState({ activatedFullscreen: true });
      window.funcs.setFullscreen(true);
    } else {
      window.funcs.setFullscreen(false);
    }
  };

  handleKeyPress = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        this.props.onNextImage();
        return;
      case "ArrowLeft":
        e.preventDefault();
        this.props.onPreviousImage();
        return;
      case "Escape":
        e.preventDefault();
        this.props.onStop();
        return;
    }
  };

  render = () => (
    <div className="image-controls">
      <Box my={1}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="button-container">
            <IconButton
              aria-label="previous"
              onClick={this.props.onPreviousImage}
            >
              <PreviousIcon />
            </IconButton>
            <IconButton aria-label="stop" onClick={this.props.onStop}>
              <StopIcon />
            </IconButton>
            <IconButton aria-label="next" onClick={this.props.onNextImage}>
              <NextIcon />
            </IconButton>
            |
            <IconButton
              aria-label="fullscreen"
              onClick={this.toggleFullscreen}
            >
              {this.state.isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            </IconButton>
          </div>
        </div>
      </Box>
    </div>
  );
}
