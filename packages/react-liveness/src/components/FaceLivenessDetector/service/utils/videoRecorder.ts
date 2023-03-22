import { Hub } from 'aws-amplify';

/**
 * The options for the video recorder.
 */
export interface VideoRecorderOptions {
  // TODO:: add options
}

const DEBUG = process.env.NEXT_PUBLIC_DEBUG === 'TRUE';

/**
 * Helper wrapper class over the native MediaRecorder.
 */
export class VideoRecorder {
  public videoStream!: ReadableStream<Blob | string>;
  public recordingStartApiTimestamp: number | undefined;
  public recorderStartTimestamp: number | undefined;
  public recorderEndTimestamp: number | undefined;
  public firstChunkTimestamp: number | undefined;

  private _recorder: MediaRecorder | null;
  private _stream: MediaStream;
  private _options: VideoRecorderOptions;
  private _chunks: Blob[];
  private _recorderStopped!: Promise<void>;

  constructor(stream: MediaStream, options: VideoRecorderOptions = {}) {
    if (typeof MediaRecorder === 'undefined') {
      throw Error('MediaRecorder is not supported by this browser');
    }

    this._stream = stream;
    this._options = options;
    this._chunks = [];
    this._recorder = new MediaRecorder(stream, { bitsPerSecond: 1000000 });

    this._setupCallbacks();
  }

  getState(): string | undefined {
    return this._recorder?.state;
  }

  start(timeSlice?: number): void {
    this.clearRecordedData();
    this.recordingStartApiTimestamp = Date.now();
    this._recorder?.start(timeSlice);
  }

  async stop(): Promise<void> {
    if (this.getState() === 'recording') {
      this._recorder?.stop();
    }
    return this._recorderStopped;
  }

  pause(): void {
    this._recorder?.pause();
  }

  clearRecordedData(): void {
    this._chunks = [];
  }

  destroy(): void {
    this.stop();
    this.clearRecordedData();
    this._recorder = null;
  }

  dispatch(event: Event): void {
    this._recorder?.dispatchEvent(event);
  }

  private _setupCallbacks() {
    // Creates a Readablestream of video chunks. Waits to receive a clientSessionInfo event before pushing
    //  a livenessActionDocument to the ReadableStream and finally closing the ReadableStream
    this._recorderStopped = new Promise((resolve) => {
      this.videoStream = new ReadableStream({
        start: (controller) => {
          if (!this._recorder) {
            return;
          }

          this._recorder.ondataavailable = (e: BlobEvent) => {
            if (e.data && e.data.size > 0) {
              if (this._chunks.length === 0) {
                this.firstChunkTimestamp = Date.now();
              }
              if (DEBUG) {
                // eslint-disable-next-line no-console
                console.log(
                  `chunk sent #${this._chunks.length}: ${JSON.stringify({
                    size: e.data.size,
                    time: Date.now(),
                  })}`
                );
                Hub.dispatch('LivenessSampleApp', {
                  event: 'chunkEvent',
                  data: { size: e.data.size },
                  message: 'Chunk sent',
                });
              }
              this._chunks.push(e.data);
              controller.enqueue(e.data);
            }
          };

          this._recorder.onstart = () => {
            this.recorderStartTimestamp = Date.now();
          };

          this._recorder.onerror = () => {
            if (this.getState() !== 'stopped') {
              this.stop();
            }
          };

          this._recorder.addEventListener('clientSesssionInfo', (e: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            controller.enqueue(e.data.clientInfo);
            if (DEBUG) {
              // eslint-disable-next-line no-console
              console.log(
                // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
                `Client Info sent: ${JSON.stringify(e.data.clientInfo)}`
              );
              Hub.dispatch('LivenessSampleApp', {
                event: 'clientInfoEvent',
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
                data: { clientInfo: e.data.clientInfo },
                message: 'Client info sent',
              });
            }
          });

          this._recorder.addEventListener('stopVideo', () => {
            controller.enqueue('stopVideo');
          });

          this._recorder.addEventListener('endStream', () => {
            controller.close();
          });

          this._recorder.onstop = () => {
            this.recorderEndTimestamp = Date.now();
            resolve();
          };
        },
      });
    });
  }
}