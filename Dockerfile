FROM public.ecr.aws/docker/library/node:20.11.1-alpine3.19 AS build
WORKDIR /app
COPY package.json /app/
# ToDo: Need to use the same lockfile as the devs, and to avoid including frontend pkgs
COPY package-lock.json /app/
#COPY api/package.json /app/api/
#COPY api/prisma /app/api/prisma
#COPY api/tsconfig.build.json /app/api/tsconfig.build.json
#COPY api/tsconfig.json /app/api/tsconfig.json
COPY api/ /app/api/
COPY contract /app/contract/
COPY sui-sdk /app/sui-sdk/
RUN npm -w api install
RUN npm run build:api

FROM build AS migrator
WORKDIR /app
ENV NODE_OPTIONS="--require=./api/dist/envfiles/load_envs.js"
RUN npm run -w api prisma:deploy

FROM public.ecr.aws/docker/library/node:20.11.1-alpine3.19 AS production
WORKDIR /app
#COPY api/package.json ./package-lock.json ./tsconfig.json ./tsconfig.build.json /app/
#COPY --from=build /app/api/package.json api/package.json
#COPY --from=build /app/api/node_modules api/node_modules
COPY --from=build /app/node_modules node_modules
#COPY --from=build /app/api/node_modules api/node_modules
COPY --from=build /app/api/dist api/dist
COPY --from=build /app/contract/package.json contract/package.json
COPY --from=build /app/contract/dist contract/dist
#COPY --from=build /app/sui-sdk/node_modules sui-sdk/node_modules
COPY --from=build /app/sui-sdk/package.json sui-sdk/package.json
COPY --from=build /app/sui-sdk/dist sui-sdk/dist
EXPOSE 8000
#CMD ["sleep", "infinity"]
ENV NODE_OPTIONS="--require=./api/dist/envfiles/load_envs.js"
CMD ["node", "api/dist/src/index.js"]
