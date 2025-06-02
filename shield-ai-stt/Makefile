export CC=/opt/homebrew/opt/llvm/bin/clang
export CXX=/opt/homebrew/opt/llvm/bin/clang++

WHISPER_DIR := $(CURDIR)/whisper.cpp
WHISPER_INCLUDE := -I$(WHISPER_DIR)/include -I$(WHISPER_DIR)/ggml/include
WHISPER_LIB := $(WHISPER_DIR)/build/src
GGML_LIB := $(WHISPER_DIR)/build/ggml/src

LIBOMP_INCLUDE := -I/opt/homebrew/opt/libomp/include
LIBOMP_LIB := -L/opt/homebrew/opt/libomp/lib

CGO_CFLAGS := $(WHISPER_INCLUDE) $(LIBOMP_INCLUDE)
CGO_LDFLAGS := -L$(WHISPER_LIB) -lwhisper \
               -L$(GGML_LIB) -lggml -lggml-base -lggml-cpu \
               $(LIBOMP_LIB) -lomp \
               -Wl,-rpath,$(WHISPER_LIB) \
               -Wl,-rpath,$(GGML_LIB) \
               -Wl,-rpath,/opt/homebrew/opt/libomp/lib

run:
	CGO_CFLAGS="$(CGO_CFLAGS)" \
	CGO_LDFLAGS="$(CGO_LDFLAGS)" \
	go run .
