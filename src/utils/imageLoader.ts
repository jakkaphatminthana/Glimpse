/**
 * Class to manage loading images and moving along the stack of said images
 */
export class ImageLoader {
  //  ToDo: Add buffering to loader;
  private readonly buffer: any = {};
  private readonly stack: string[] = [];
  private readonly shownImages: Set<string> = new Set();
  private allShownTriggered = false;

  private position?: number = undefined;
  private onAllShown?: () => void;
  /**
   * @param files
   * List of failes to go through
   * @param noRepeat
   * If true, images won't repeat until all have been shown
   * @param onAllShown
   * Callback when all images have been shown (only for noRepeat mode)
   */
  constructor(
    private files: string[],
    private noRepeat: boolean = false,
    onAllShown?: () => void,
  ) {
    if (!files && !files.length) throw new Error("No files given");
    this.onAllShown = onAllShown;
  }

  resetShownImages = () => {
    this.shownImages.clear();
    this.allShownTriggered = false;
  };

  getImage = (filename: string): Promise<string> =>
    window.funcs.loadImage(filename).then((img: string) => {
      return img;
    });

  getRandomFilename = (): string | null => {
    if (this.noRepeat) {
      // Get list of images not yet shown
      const availableImages = this.files.filter(
        (f) => !this.shownImages.has(f),
      );

      // If all images have been shown, trigger callback
      if (availableImages.length === 0) {
        if (!this.allShownTriggered && this.onAllShown) {
          this.allShownTriggered = true;
          this.onAllShown();
        }
        return null;
      }

      const randomIndex = Math.floor(Math.random() * availableImages.length);
      const filename = availableImages[randomIndex];
      this.shownImages.add(filename);
      return filename;
    }

    const randomImageIndex = Math.floor(Math.random() * this.files.length);
    return this.files[randomImageIndex];
  };

  getNewFilename = (): string | null => {
    const filename = this.getRandomFilename();

    if (filename === null) return null;

    // If we got the same file as the last one and we have more than one image
    // try to get a different one for a better "randomization" (only for non-noRepeat mode)
    if (
      !this.noRepeat &&
      filename === this.stack[this.position] &&
      this.files.length > 1
    )
      return this.getNewFilename();

    return filename;
  };

  forward = () => {
    // If at the last position in the stack generate a new image;
    if (
      this.position === undefined ||
      this.position === this.stack.length - 1
    ) {
      const filename = this.getNewFilename();
      // If no more images available (noRepeat mode exhausted), return null
      if (filename === null) {
        return Promise.resolve(null);
      }
      this.stack.push(filename);
      this.position = this.stack.length - 1;
      return this.getImage(filename).then((src) => ({ filename, src }));
    } else {
      const filename = this.stack[++this.position];
      return this.getImage(filename).then((src) => ({ filename, src }));
    }
  };

  backwards = async () => {
    if (!this.position || this.position === 0) return null;

    const filename = this.stack[--this.position];
    const src = await this.getImage(filename);
    return { filename, src };
  };
}

