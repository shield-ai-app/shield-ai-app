package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
)

// TranscribeRemote sends raw PCM audio bytes and channel count to your HTTP server
// and returns the transcription text (plain text, no JSON).
func TranscribeRemote(serverURL string, pcm []byte, channels int) (string, error) {
	reqURL := fmt.Sprintf("%s/transcribe?channels=%d", serverURL, channels)

	req, err := http.NewRequest("POST", reqURL, bytes.NewReader(pcm))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/octet-stream")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return "", fmt.Errorf("server returned status %d: %s", resp.StatusCode, string(bodyBytes))
	}

	// Read plain text transcription
	textBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read transcription response: %w", err)
	}

	return string(textBytes), nil
}
