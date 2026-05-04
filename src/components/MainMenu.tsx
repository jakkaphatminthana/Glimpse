import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ArrowDropDown from "@mui/icons-material/ArrowDropDown";
import React from "react";
import { Header } from "./Header";
import { getSettings, setSettings } from "../utils/localStorage";

interface IProps {
  onDirSelected(filepaths: string[], noRepeat: boolean): void;
}

interface IState {
  folders: string[];
  noRepeat: boolean;
}

export default class MainMenu extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    const settings = getSettings();
    this.state = {
      folders: null,
      noRepeat: settings.noRepeat ?? false,
    };
  }

  onLoadFolder = async () => {
    const result = await window.funcs.loadFolder();
    if (result.canceled) return;
    this.setState({ folders: result.filePaths });
  };

  clearFolders = () => this.setState({ folders: null });

  toggleNoRepeat = (event: React.ChangeEvent<HTMLInputElement>) => {
    const noRepeat = event.target.checked;
    setSettings({ ...getSettings(), noRepeat });
    this.setState({ noRepeat });
  };

  start = () => {
    this.props.onDirSelected(this.state.folders, this.state.noRepeat);
  };

  render() {
    return (
      <div className="main">
        <div className="main-menu">
          <Header />

          {!this.state.folders && (
            <div>
              <Button
                className="wide"
                variant="contained"
                onClick={this.onLoadFolder}
              >
                Choose folder
              </Button>
            </div>
          )}

          {this.state.folders?.length && (
            <div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Button
                  startIcon={<ChevronLeftIcon />}
                  onClick={this.clearFolders}
                  aria-label="back"
                >
                  back
                </Button>
              </div>

              <Box mb={1}>
                <Accordion defaultExpanded>
                  <AccordionSummary expandIcon={<ArrowDropDown />}>
                    Additional settings
                  </AccordionSummary>
                  <AccordionDetails sx={{ marginInline: "20px 0" }}>
                    <FormGroup>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={this.state.noRepeat}
                            onChange={this.toggleNoRepeat}
                          />
                        }
                        label="No repeat (show each image once)"
                      />
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </Box>

              <Button
                variant="contained"
                className="wide"
                onClick={this.start}
              >
                Start
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }
}
