# Use node.js v8 as build env
FROM node:8

ENV NODE_ENV development

# Install serverless framework and cross-env
RUN npm install serverless@1.47.0 -g
RUN npm install cross-env -g
