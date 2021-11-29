.DEFAULT_GOAL:=help

export PATH:=./node_modules/.bin/:$(PATH)

INSTALL_INDICATOR = node_modules/.package-lock.json
HORDE_BUILD = horde
HORDE_BUILD_INDICATOR = ${HORDE_DEV_BUILD}/js/main.js

REACT_BUILD = build
REACT_BUILD_INDICATOR = ${REACT_BUILD}/index.html

# All json files which we want to keep in good shape
# Translation files are sorted by `i18next`
JSON_FILES = package.json tsconfig.json .eslintrc.json

SRC_FILES = $(shell find src -type f \
						-not -path '*__tests__*' \
						-not -name '*.d.ts' \
						-not -name 'setupTests.*' \
						\( -name '*.ts' -or -name '*.tsx' -or -name '*.js' \)\
				)

#I18NEXT_PARSER_CONFIG = i18next-parser.config.js
#FALLBACK_TRANSLATIONS = src/fallbackTranslations/translation.json

.PHONY: help
help: ## Display this help message
	@echo 'Usage: make <command>'
	@cat $(MAKEFILE_LIST) | grep '^[a-zA-Z]'  | \
	    sort | \
	    awk -F ':.*?## ' 'NF==2 {printf "  %-26s%s\n", $$1, $$2}'

.PHONY: clean
clean: ## Delete all build folders
	rm -rf build/
	rm -rf release/

.PHONY: format
format: ${INSTALL_INDICATOR} ## Run formatters in write mode: prettier
	@command -v jq >> /dev/null || (echo "Please install the jq package"; exit 1)
	@command -v sponge >> /dev/null || (echo "Please install the moreutils package"; exit 1)
	prettier --write src public *.md
	for file in ${JSON_FILES}; do jq --sort-keys . $$file | sponge $$file; done

.PHONY: check
check: ts-check lint ## Run all checks/linters

${INSTALL_INDICATOR}: package.json package-lock.json
	npm install

.PHONY: codespell
codespell: ## Run codespell
	codespell

# Treat every warning as error if this command is used
# They are "only" warnings inside the configuration to not hinder during
# development
.PHONY: lint
lint: ${INSTALL_INDICATOR} ## Run linters: eslint
	eslint src --cache --ext .js,.tsx,.ts,.json,.snap --max-warnings=0

.PHONY: ts-check
ts-check: ${INSTALL_INDICATOR} ## Check Typescript correctness
	tsc --noEmit

.PHONY: run-dev
run-dev: ${INSTALL_INDICATOR} ## Run a development server with auto reload
	react-scripts start

ifeq ($(SOURCEMAPS),)
GENERATE_SOURCEMAP=false
else
GENERATE_SOURCEMAP=true
endif


${HORDE_BUILD_INDICATOR}: ${SRC_FILES} ${INSTALL_INDICATOR}
	env BUILD_PATH=${HORDE_BUILD} GENERATE_SOURCEMAP=${GENERATE_SOURCEMAP} \
		craco build
# Make asset paths (fonts, images) relative
	sed -i -e 's_/themes/default/__g' ${HORDE_BUILD}/themes/default/main.css
	rm -f \
		${HORDE_BUILD}/asset-manifest.json \
		${HORDE_BUILD}/index.html \
		${HORDE_BUILD}/favicon.ico \
		${HORDE_BUILD}/themes/default/getFetch.cjs
#install -D src/fallbackTranslations/translation.json ${HORDE_BUILD}/locale/json/en/translation.json

.PHONY: horde
horde: ${HORDE_BUILD_INDICATOR} ${INSTALL_INDICATOR} ## Horde-compatible build, enable sourcemaps with SOURCEMAPS=1

${REACT_BUILD_INDICATOR}: ${SRC_FILES} ${INSTALL_INDICATOR}
	react-scripts build

.PHONY: build
build: ${REACT_BUILD_INDICATOR} ${INSTALL_INDICATOR} ## Straight build by `react-scripts` for standalone usage

.PHONY: test
test: ${INSTALL_INDICATOR} ## Run test suite and rerun any modified test
	react-scripts test --coverage

.PHONY: test-noninteractive
test-noninteractive: ${INSTALL_INDICATOR} ## Run all tests and exit afterwards
	react-scripts test --coverage --watchAll=false

.PHONY: run-inside-CI
run-inside-CI:
	@if [ -z $${CI+x} ]; then echo "Can only run inside CI"; exit 1; fi

.PHONY: test-update-snapshots
test-update-snapshots: ${INSTALL_INDICATOR} run-inside-CI ## Update snapshots inside CI
	env SNAPSHOT_TESTS=1 react-scripts test --updateSnapshot

DOCKER ?= docker
IMAGE_NAME ?= sim_portal
IMAGE_TAG ?= $(shell git describe --abbrev)

.PHONY: docker
docker: ${REACT_BUILD_INDICATOR} ## Build a docker image with specified based on the dev backend
	${DOCKER} build -t ${IMAGE_NAME}:${IMAGE_TAG} .


.PHONY: translations
translations: ${INSTALL_INDICATOR}  ## Detects new/missing translations keys
	i18next --config ${I18NEXT_PARSER_CONFIG}

#.PHONY: translations-check
#translations-check: translations ## Exits with 1 if any translations are missing
#	@! grep '__STRING_NOT_TRANSLATED__' ${FALLBACK_TRANSLATIONS}

.PHONY: setup
setup: ## Setup development environment
	@echo 'Requires pre-commit from https://pre-commit.com/'
	pre-commit install

## BEGIN debugging rules/helpers
ECHO_INTERNAL_VARS_TARGET =  print-JSON_FILES print-SRC_FILES
.PHONY: echo-internal-vars
echo-internal-vars: ${ECHO_INTERNAL_VARS_TARGET} ## Show values of internal variables

# Credits to https://stackoverflow.com/questions/16467718/how-to-print-out-a-variable-in-makefile
.PHONY: print-%
print-% : ; $(info $* is a $(flavor $*) variable set to [$($*)]) @true
## END debugging rules/helpers
