FROM public.ecr.aws/docker/library/node:22.5.1-alpine3.19 AS base-node

FROM base-node AS build
WORKDIR /app
COPY ./package.json /app/
COPY ./package-lock.json /app/
#COPY ./package.json /app/
#COPY ./prisma /app/prisma
#COPY ./tsconfig.build.json /app/tsconfig.build.json
#COPY ./tsconfig.json /app/tsconfig.json
COPY ./ /app/
RUN npm install
RUN npm run build
#CMD ["sleep", "infinity"]

FROM build AS develop
EXPOSE 8000
#CMD ["sleep", "infinity"]
ENV NODE_OPTIONS="--require=./envfiles/load_envs.js"
CMD ["node", "./dist/main.js"]

FROM build AS migrator
WORKDIR /app
ENV NODE_OPTIONS="--require=./envfiles/load_envs.js"
RUN npm run prisma:deploy
#CMD ["sleep", "infinity"]

FROM base-node AS production
WORKDIR /app
#COPY ./package.json ./package-lock.json ./tsconfig.json ./tsconfig.build.json /app/
#COPY --from=build /app/package.json ./package.json
#COPY --from=build /app/node_modules ./node_modules
# ToDo: In fact, this node_modules was not optimized without dev dependencies
COPY --from=build /app/node_modules node_modules
#COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/swagger ./swagger
COPY --from=build /app/envfiles ./envfiles
EXPOSE 8000
#CMD ["sleep", "infinity"]
ENV NODE_OPTIONS="--require=./envfiles/load_envs.js"
CMD ["node", "./dist/main.js"]
