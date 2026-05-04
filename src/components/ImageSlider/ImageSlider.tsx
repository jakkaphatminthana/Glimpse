import React from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { ImageLoader } from "../../utils/imageLoader";
import SliderControls from "./SliderControls";
import Loader from "./Loader";

interface IProps {
  folders: string[];
  noRepeat: boolean;
  onStop(): void;
}

interface IState {
  files: string[];
  filename: string;
  src: string;
  hasLoaded: boolean;
  showAllShownDialog: boolean;
}

export default class ImageSlider extends React.Component<IProps, IState> {
  imageLoader: ImageLoader;

  constructor(props: IProps) {
    super(props);
    this.state = {
      files: [],
      filename: "",
      src: undefined,
      hasLoaded: false,
      showAllShownDialog: false,
    };
  }

  componentDidMount(): void {
    window.funcs
      .getDirFilesList(this.props.folders)
      .then((files: string[]) => {
        this.imageLoader = new ImageLoader(
          files,
          this.props.noRepeat,
          this.onAllImagesShown,
        );
        this.setState(
          { files: this.state.files.concat(files), hasLoaded: true },
          () => {
            this.loadRandomImage();
          },
        );
      })
      .catch(console.error);
  }

  loadRandomImage() {
    this.imageLoader.forward().then((result) => {
      if (result) {
        const { filename, src } = result;
        this.setState({ filename, src });
      }
    });
  }

  previousImage = () => {
    this.imageLoader.backwards().then((result) => {
      if (!result) return;
      const { filename, src } = result;
      this.setState({ filename, src });
    });
  };

  nextImage = () => {
    this.loadRandomImage();
  };

  stop = () => {
    this.props.onStop();
  };

  onAllImagesShown = () => {
    this.setState({ showAllShownDialog: true });
  };

  handleRestartImages = () => {
    this.imageLoader.resetShownImages();
    this.setState({ showAllShownDialog: false });
    this.loadRandomImage();
  };

  handleStopAfterAllShown = () => {
    this.setState({ showAllShownDialog: false });
    this.stop();
  };

  render() {
    return (
      <div className="image-slider-area">
        {this.state.hasLoaded ? (
          <>
            <div id="image-container">
              {this.state.src && <img src={this.state.src} />}
            </div>

            <SliderControls
              onNextImage={this.nextImage}
              onPreviousImage={this.previousImage}
              onStop={this.stop}
            />

            <Dialog open={this.state.showAllShownDialog}>
              <DialogTitle>All images have been displayed</DialogTitle>
              <DialogContent>
                <DialogContentText>
                  All images have been shown. Would you like to restart or stop?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={this.handleStopAfterAllShown}>Stop</Button>
                <Button
                  onClick={this.handleRestartImages}
                  variant="contained"
                >
                  Restart
                </Button>
              </DialogActions>
            </Dialog>
          </>
        ) : (
          <Loader />
        )}
      </div>
    );
  }
}
