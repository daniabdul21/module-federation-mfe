# Default Images
FROM default-route-openshift-image-registry.apps.ocp-new-dev.bri.co.id/bricams/node:18-alpine AS build

# Add Proxy
ENV http_proxy http://172.18.104.20:1707
ENV https_proxy http://172.18.104.20:1707

# Setting Node
ENV NODE_OPTIONS="--max-old-space-size=4096"

# User must root
USER root

# Copy package.json & yarn.lock
COPY package.json /usr/src/app/addons-build/package.json
COPY ../tmp1/yarn.lock /usr/src/app/addons-build/yarn.lock

# Set workdir
WORKDIR /usr/src/app/addons-build/

# Install dependency
RUN yarn install

# Copy all file to workdir
COPY ../tmp1 /usr/src/app/addons-build/

# Give permission to
RUN chmod -R 777 /usr/src/app/addons-build/

# Set Environment variable
ARG NEXT_PUBLIC_API_URL_DEV_ID
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL_DEV_ID
ARG NEXT_PUBLIC_API_URL_DEV_TL
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL_DEV_TL
ARG NEXT_PUBLIC_API_URL_DEV_SG
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL_DEV_SG
ARG NEXT_PUBLIC_API_URL_PRESTAGE
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL_PRESTAGE
ARG NEXT_PUBLIC_API_URL_PREPLOY
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL_PREPLOY
ARG NEXT_PUBLIC_API_URL_PROD
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL_PROD
ARG NEXT_PUBLIC_API_URL_PROD_TL
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL_PROD_TL
ARG NEXT_PUBLIC_API_URL_PROD_SG
ENV NEXT_PUBLIC_API_URL $NEXT_PUBLIC_API_URL_PROD_SG
ARG NEXT_PUBLIC_SIGNATURE
ENV NEXT_PUBLIC_SIGNATURE $NEXT_PUBLIC_SIGNATURE
ARG NEXT_PUBLIC_LIMIT_MEGABITPERSEC
ENV NEXT_PUBLIC_LIMIT_MEGABITPERSEC $NEXT_PUBLIC_LIMIT_MEGABITPERSEC
ARG NEXT_PUBLIC_SECRET_KEY_LOGIN_V2
ENV NEXT_PUBLIC_SECRET_KEY_LOGIN_V2 $NEXT_PUBLIC_SECRET_KEY_LOGIN_V2
ARG NEXT_PUBLIC_DATAVIZ
ENV NEXT_PUBLIC_DATAVIZ $NEXT_PUBLIC_DATAVIZ
ARG NEXT_PUBLIC_MAX_RECORD
ENV NEXT_PUBLIC_MAX_RECORD $NEXT_PUBLIC_MAX_RECORD
ARG NEXT_PRIVATE_LOCAL_WEBPACK
ENV NEXT_PRIVATE_LOCAL_WEBPACK $NEXT_PRIVATE_LOCAL_WEBPACK

# Build process
RUN yarn build

# Check folder
RUN ls -la /usr/src/app/addons-build/

# Clear proxy
ENV http_proxy ''
ENV https_proxy ''

# Default Images
FROM default-route-openshift-image-registry.apps.ocp-new-dev.bri.co.id/bricams/node:18-alpine AS app
WORKDIR /usr/src/app/addons-build/
COPY --from=build /usr/src/app/addons-build/ ./
COPY --from=build /usr/src/app/addons-build/node_modules ./node_modules
CMD ["yarn", "start"]
# test push code
