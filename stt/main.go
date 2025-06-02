package main

import (
	"encoding/binary"
	"errors"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
	"sync"

	"github.com/ggerganov/whisper.cpp/bindings/go/pkg/whisper"
)

// Transcriber wraps Whisper model with mutex protection.
type Transcriber struct {
	model whisper.Model
	mu    sync.Mutex
}

func NewTranscriber(modelPath string) *Transcriber {
	log.Printf("Loading Whisper model from %s…", modelPath)

	model, err := whisper.New(modelPath)
	if err != nil {
		log.Fatalf("Failed to load model: %v", err)
	}

	return &Transcriber{model: model}
}

// Convert PCM 16-bit little endian stereo or mono PCM bytes to float32 mono samples.
func pcmToFloat32Mono(pcm []byte, channels int) ([]float32, error) {
	sampleCount := len(pcm) / 2
	if sampleCount%channels != 0 {
		return nil, errors.New("pcm length not multiple of channels")
	}
	frames := sampleCount / channels

	monoSamples := make([]float32, frames)
	for i := 0; i < frames; i++ {
		var sum int32
		for ch := 0; ch < channels; ch++ {
			offset := (i*channels + ch) * 2
			sample := int16(binary.LittleEndian.Uint16(pcm[offset : offset+2]))
			sum += int32(sample)
		}
		avg := sum / int32(channels)
		monoSamples[i] = float32(avg) / 32768.0
	}
	return monoSamples, nil
}

// TranscribePCM accepts raw PCM bytes and channel count, returns transcription text.
func (t *Transcriber) TranscribePCM(pcm []byte, channels int) (string, error) {
	samples, err := pcmToFloat32Mono(pcm, channels)
	if err != nil {
		return "", err
	}

	t.mu.Lock()
	defer t.mu.Unlock()

	ctx, err := t.model.NewContext()
	if err != nil {
		return "", err
	}

	var builder strings.Builder
	segmentCB := func(s whisper.Segment) {
		builder.WriteString(s.Text)
		builder.WriteRune(' ')
	}

	if err := ctx.Process(samples, nil, segmentCB, nil); err != nil {
		return "", err
	}

	return strings.TrimSpace(builder.String()), nil
}

// HTTP handler for /transcribe endpoint
func transcribeHandler(t *Transcriber) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "Only POST method allowed", http.StatusMethodNotAllowed)
			return
		}

		// Get channels from query param, default to 1
		channels := 1
		chStr := r.URL.Query().Get("channels")
		if chStr != "" {
			if chVal, err := strconv.Atoi(chStr); err == nil && chVal > 0 {
				channels = chVal
			} else {
				http.Error(w, "Invalid channels query parameter", http.StatusBadRequest)
				return
			}
		}

		defer r.Body.Close()
		audioData, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Failed to read audio data: "+err.Error(), http.StatusBadRequest)
			return
		}

		text, err := t.TranscribePCM(audioData, channels)
		if err != nil {
			http.Error(w, "Failed to transcribe audio: "+err.Error(), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		_, _ = w.Write([]byte(text))
	}
}

func main() {
	const modelPath = "model.bin" // path to your whisper model

	transcriber := NewTranscriber(modelPath)
	defer transcriber.model.Close()

	http.HandleFunc("/transcribe", transcribeHandler(transcriber))

	port := ":8080"
	log.Printf("Starting server on port %s", port)
	log.Fatal(http.ListenAndServe(port, nil))
}
