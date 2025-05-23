#!/bin/bash
cd /home/kavia/workspace/code-generation/noteease-8280-8285/noteease_main_container
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

