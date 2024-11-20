FROM public.ecr.aws/docker/library/node:22.5.1-alpine3.19 AS build
WORKDIR /app
COPY package.json /app/
# ToDo: Need to use the same lockfile as the devs, and to avoid including frontend pkgs
COPY package-lock.json /app/
#COPY ./package.json /app/
#COPY ./prisma /app/prisma
#COPY ./tsconfig.build.json /app/tsconfig.build.json
#COPY ./tsconfig.json /app/tsconfig.json
COPY ./ /app/
RUN npm install
RUN npm run build

FROM build AS migrator
WORKDIR /app
ENV NODE_OPTIONS="--require=./dist/envfiles/load_envs.js"
RUN npm run prisma:deploy

FROM public.ecr.aws/docker/library/node:20.11.1-alpine3.19 AS production
WORKDIR /app
#COPY ./package.json ./package-lock.json ./tsconfig.json ./tsconfig.build.json /app/
#COPY --from=build /app/package.json ./package.json
#COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/node_modules node_modules
#COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
EXPOSE 8000
#CMD ["sleep", "infinity"]
ENV NODE_OPTIONS="--require=./dist/envfiles/load_envs.js"
CMD ["node", "./dist/src/index.js"]
