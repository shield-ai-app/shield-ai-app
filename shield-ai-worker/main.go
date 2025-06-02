package main

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/hajimehoshi/oto"
	"github.com/tosone/minimp3"
)

var c *oto.Context
var p *oto.Player

const AUDIO_FRAME_SIZE_PER_10_MS = 512
const AUDIO_TRANSLATION_WINDOW_SIZE_IN_SEC = 10
const TRANSCRIBER_HOST_URL = "http://localhost:8080"

func main() {
	// Check if URL is passed as a command-line argument
	var args = os.Args
	if len(args) != 2 {
		log.Fatal("Missing stream URL")
	}

	url := args[1]

	for {
		ctx := context.Background()
		processAudioFromStreamUrl(ctx, url)
	}
}

// Hangs forever and processes audio from the url
func processAudioFromStreamUrl(ctx context.Context, url string) {
	log.Printf("Creating stream decoder with url %s\n", url)
	dec, cleanStream, err := createStream(url)

	if c == nil {
		c, err = oto.NewContext(dec.SampleRate, dec.Channels, 2, 4096)
		if err != nil {
			log.Fatalf("Got an error creating the audio player: %v\n", err)
			return
		}
	}

	if p == nil {
		p = c.NewPlayer()
	}

	if err != nil {
		log.Fatalf("Failed to start stream with err: %v\n", err)
	}

	messages := make(chan []byte)
	ctx, cancel := context.WithCancel(ctx)
	c := func(err error) {
		log.Printf("Killed main loop thread with err: %v\n", err)
		cleanStream()
		cancel()
		close(messages)
	}

	log.Println("Main loop thread has begun.")

	for {
		streamPlayerLoop(ctx, c, dec, messages)
		translateStreamLoop(ctx, messages, dec.Channels)
		select {
		// Hang on the context until it is canceled and restart everything
		case <-ctx.Done():
			return
		}
	}
}

func translateWaveform(clip []byte, channels int) (string, error) {
	text, err := TranscribeRemote(TRANSCRIBER_HOST_URL, clip, channels)
	if err != nil {
		return "", err
	}
	return text, nil
}

// Translates audio bytes from the buffer channel in a separate thread. Can be killed by canceling the context
func translateStreamLoop(ctx context.Context, buffer chan []byte, channels int) {
	go func() {
		log.Println("Translate stream loop thread has begun.")
		// Total size of the sliding window in bytes
		const windowSize = AUDIO_FRAME_SIZE_PER_10_MS * (1000 / 10) * AUDIO_TRANSLATION_WINDOW_SIZE_IN_SEC
		window := make([]byte, 0, windowSize)
		for {
			select {
			case <-ctx.Done():
			case clip := <-buffer:
				// Append clip to window
				if len(window)+len(clip) <= windowSize {
					window = append(window, clip...)
				} else {
					// Slide the window: remove oldest data to make space
					overflow := len(window) + len(clip) - windowSize
					window = append(window[overflow:], clip...)
				}

				// When window is full, trigger translation
				if len(window) == windowSize {
					go func(data []byte) {
						result, err := translateWaveform(data, channels)
						if err != nil {
							log.Printf("Error translating audio: %v", err)
						} else {
							log.Printf("Translation result: %s", result)
						}
					}(append([]byte{}, window...)) // send a copy of window

					// Optionally reset the window for the next batch
					window = window[:0]
				}
			default:
				time.Sleep(10 * time.Millisecond) // Avoid tight spin
			}
		}
	}()
}

// Reads from the audio decoder and pushes data into the buffer channel. Can be killed by canceling the context
func streamPlayerLoop(ctx context.Context, cancel func(error), dec *minimp3.Decoder, buffer chan []byte) {
	// Start playing audio in a separate goroutine
	go func() {
		log.Println("Stream player loop thread has begun.")
		// Create a buffer to store audio data
		var data = make([]byte, AUDIO_FRAME_SIZE_PER_10_MS)
		for {
			select {
			case <-ctx.Done():
				log.Printf("Stream player loop thread was killed by context: %v\n", ctx.Err())
				break
			default:
			}
			// Read the decoded MP3 data
			_, err := dec.Read(data)
			if err == io.EOF {
				// End of stream, stop playback
				cancel(fmt.Errorf("Stream player loop thread was killed by EOF"))
				break
			} else if err != nil {
				log.Printf("Error reading data: %v\n", err)
			} else {
				p.Write(data)
				// Send the data into the buffer channel to be processed by a different thread
				buffer <- data
			}
		}
	}()
}

func createStream(url string) (*minimp3.Decoder, func(), error) {
	// Fetch the MP3 stream from the URL
	var response *http.Response
	response, err := http.Get(url)
	if err != nil {
		return nil, nil, err
	}

	// Initialize the MP3 decoder
	if dec, err := minimp3.NewDecoder(response.Body); err != nil {
		return nil, nil, err
	} else {
		log.Println("Waiting for stream decoder to be ready")
		<-dec.Started()
		log.Printf("Stream decoder ready - Audio sample rate: %d, channels: %d\n", dec.SampleRate, dec.Channels)

		return dec, func() {
			response.Body.Close()
			log.Printf("Closing decoder...")
			// Wait for a second before closing the decoder
			<-time.After(time.Second)
			dec.Close()
		}, nil
	}
}
