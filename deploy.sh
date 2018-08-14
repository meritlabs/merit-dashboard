#!/usr/bin/env bash

print_in_color() {
    printf "%b" \
        "$(tput setaf "$2" 2> /dev/null)" \
        "$1" \
        "$(tput sgr0 2> /dev/null)"
}

print_in_green() {
    print_in_color "$1" 2
}

print_in_purple() {
    print_in_color "$1" 5
}

print_in_red() {
    print_in_color "$1" 1
}

print_in_yellow() {
    print_in_color "$1" 3
}

print_question() {
    print_in_yellow "   [?] $1"
}

set -euo pipefail

environment=""
target=""
deploy_token=""
build_file_path=""
deploy_file_path=""
firebase_project=""
env_vars=""
build_tag=""
market_env_vars=""

setDesktopParams() {
    target="desktop"
    firebase_project="staging-merit-dashboard"
    build_file_path="desktop"
    deploy_file_path="desktop"
}

setRunLevelProduction() {
    environment="production"
    firebase_project="staging-merit-dashboard"
    build_tag=":prod"
    market_env_vars=""
}

setRunLevelStaging() {
    environment="staging"
    firebase_project="staging-merit-dashboard"
    build_tag=""
    market_env_vars="DASHBOARD_STAGING=true"
}

productionPrompt() {
    while true; do
        read -p "Would you like to deploy to Dashboard to production? [Y/N]: " yn
        case $yn in
            [Yy]* ) setRunLevelProduction; break;;
            [Nn]* ) setRunLevelStaging; break;;
            * ) echo "Please answer yes or no.";;
        esac
    done
}

while getopts ":e:k:" opt; do
  case $opt in
    e) environment="$OPTARG"
    ;;
    k) deploy_token="$OPTARG"
    ;;
    \?) echo "Invalid option -$OPTARG" >&2
    ;;
  esac
done

setDesktopParams;

if [ "$environment" != "staging" ] && [ "$environment" != "production" ]; then
    print_in_red "No environment passed in with -e.  Prompting for input.\n"
    productionPrompt;
else
    if [ "$environment" == "production" ]; then
        setRunLevelProduction;
    else
        setRunLevelStaging;
    fi
fi

print_in_yellow "Building Dashboard for $environment-environment now \n"
pushd $build_file_path
if [ ! -z "$market_env_vars" ]; then
    print_in_yellow "Running export $market_env_vars \n"
    export ${market_env_vars}
fi
print_in_yellow "Running npm run build$build_tag \n"
npm run build$build_tag
popd

pushd $deploy_file_path
if [[ $deploy_token = *[!\ ]* ]]; then
    print_in_yellow "Deploying using token firebase auth.\n"
    print_in_yellow "Using firebase project: $firebase_project \n"
    firebase use $firebase_project --token $deploy_token

    print_in_green "Deploying to firebase now! \n"

    firebase deploy --token $deploy_token
else
    print_in_yellow "Deploying using general firebase auth.\n"
    print_in_yellow "Using firebase project: $firebase_project \n"
    firebase use $firebase_project

    print_in_green "Deploying to firebase now! \n"

    firebase deploy
fi
